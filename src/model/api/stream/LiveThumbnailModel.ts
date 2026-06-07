import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { inject, injectable } from 'inversify';
import * as http from 'http';
import * as apid from '../../../../api';
import IConfigFile from '../../IConfigFile';
import IConfiguration from '../../IConfiguration';
import ILogger from '../../ILogger';
import ILoggerModel from '../../ILoggerModel';
import IMirakurunClientModel from '../../IMirakurunClientModel';
import ILiveThumbnailModel from './ILiveThumbnailModel';

interface CacheItem {
    buffer: Buffer;
    expireAt: number;
}

/**
 * 放送中チャンネルのサムネイル (静止画 1 枚) を生成するモデル。
 *
 * mirakurun から生 TS を受け取り ffmpeg で 1 フレームだけ JPEG 化する。
 * チューナーは有限資源なので以下で保護する:
 *   - 同一チャンネルへの同時リクエストは 1 本に集約する (inflight)
 *   - 全体の同時生成数を CONCURRENCY に制限する
 *   - 生成結果を CACHE_TTL の間だけメモリキャッシュする
 *   - TIMEOUT を過ぎたらプロセスとストリームを強制的に破棄してチューナーを解放する
 */
@injectable()
export default class LiveThumbnailModel implements ILiveThumbnailModel {
    /** キャッシュ保持時間 (ms) */
    private static readonly CACHE_TTL = 60 * 1000;
    /** 同時生成数の上限 */
    private static readonly CONCURRENCY = 2;
    /** 1 枚あたりの生成タイムアウト (ms) */
    private static readonly TIMEOUT = 12 * 1000;

    private log: ILogger;
    private config: IConfigFile;
    private mirakurunClientModel: IMirakurunClientModel;

    private cache: Map<apid.ChannelId, CacheItem> = new Map();
    private inflight: Map<apid.ChannelId, Promise<Buffer | null>> = new Map();
    private running = 0;

    constructor(
        @inject('ILoggerModel') logger: ILoggerModel,
        @inject('IConfiguration') configuration: IConfiguration,
        @inject('IMirakurunClientModel') mirakurunClientModel: IMirakurunClientModel,
    ) {
        this.log = logger.getLogger();
        this.config = configuration.getConfig();
        this.mirakurunClientModel = mirakurunClientModel;
    }

    /**
     * 指定チャンネルの放送中サムネイルを取得する
     * @param channelId: apid.ChannelId
     * @return Promise<Buffer | null> 生成できなかった場合は null
     */
    public async getThumbnail(channelId: apid.ChannelId): Promise<Buffer | null> {
        // キャッシュヒット
        const cached = this.cache.get(channelId);
        if (typeof cached !== 'undefined' && cached.expireAt > Date.now()) {
            return cached.buffer;
        }

        // 生成中なら相乗りする
        const running = this.inflight.get(channelId);
        if (typeof running !== 'undefined') {
            return running;
        }

        const task = this.createThumbnail(channelId)
            .then(buffer => {
                if (buffer !== null) {
                    this.cache.set(channelId, {
                        buffer: buffer,
                        expireAt: Date.now() + LiveThumbnailModel.CACHE_TTL,
                    });
                }

                return buffer;
            })
            .catch(err => {
                this.log.system.warn(`create live thumbnail failed: ${channelId}`);
                this.log.system.warn(err);

                return null;
            })
            .finally(() => {
                this.inflight.delete(channelId);
            });

        this.inflight.set(channelId, task);

        return task;
    }

    /**
     * 実際に mirakurun + ffmpeg でサムネイルを生成する
     * @param channelId: apid.ChannelId
     * @return Promise<Buffer | null>
     */
    private async createThumbnail(channelId: apid.ChannelId): Promise<Buffer | null> {
        if (this.running >= LiveThumbnailModel.CONCURRENCY) {
            this.log.system.info(`live thumbnail is busy, skip: ${channelId}`);

            return null;
        }
        this.running++;

        let stream: http.IncomingMessage | null = null;
        let child: ChildProcessWithoutNullStreams | null = null;

        try {
            const mirakurun = this.mirakurunClientModel.getClient();
            // 録画を妨げないよう streamingPriority (通常 0) で取得する
            stream = await mirakurun.getServiceStream(channelId, true, this.config.streamingPriority);

            const width = parseInt(this.config.thumbnailSize.split('x')[0], 10) || 480;

            child = spawn(this.config.ffmpeg, [
                '-y',
                '-fflags',
                '+discardcorrupt',
                '-analyzeduration',
                '3000000',
                '-probesize',
                '5000000',
                '-i',
                'pipe:0',
                '-map',
                '0:v:0',
                '-frames:v',
                '1',
                '-vf',
                `scale=${width}:-2`,
                '-f',
                'image2',
                '-vcodec',
                'mjpeg',
                'pipe:1',
            ]);

            const result = await this.runFfmpeg(stream, child);

            return result;
        } finally {
            // 後始末。チューナーを必ず解放する
            if (child !== null) {
                child.stdin.destroy();
                child.stdout.destroy();
                child.stderr.destroy();
                child.kill('SIGKILL');
            }
            if (stream !== null) {
                stream.unpipe();
                stream.destroy();
            }
            this.running--;
        }
    }

    /**
     * mirakurun stream を ffmpeg に流し込み JPEG バッファを得る
     */
    private runFfmpeg(
        stream: http.IncomingMessage,
        child: ChildProcessWithoutNullStreams,
    ): Promise<Buffer | null> {
        return new Promise<Buffer | null>(resolve => {
            const chunks: Buffer[] = [];
            let settled = false;

            const finish = (buffer: Buffer | null): void => {
                if (settled === true) {
                    return;
                }
                settled = true;
                clearTimeout(timer);
                resolve(buffer);
            };

            const timer = setTimeout(() => {
                this.log.system.warn('live thumbnail timeout');
                finish(null);
            }, LiveThumbnailModel.TIMEOUT);

            child.stdout.on('data', chunk => {
                chunks.push(chunk);
            });

            // ffmpeg のログは debug 時のみ
            child.stderr.on('data', data => {
                this.log.system.debug(String(data));
            });

            child.on('error', err => {
                this.log.system.warn(err);
                finish(null);
            });

            child.on('close', () => {
                const buffer = Buffer.concat(chunks);
                finish(buffer.length > 0 ? buffer : null);
            });

            stream.on('error', err => {
                this.log.system.warn(err);
                finish(null);
            });

            stream.pipe(child.stdin);
            // ffmpeg 側が先に閉じても EPIPE で落とさない
            child.stdin.on('error', () => {});
        });
    }
}
