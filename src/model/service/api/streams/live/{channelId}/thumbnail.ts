import { Operation } from 'express-openapi';
import ILiveThumbnailModel from '../../../../../api/stream/ILiveThumbnailModel';
import container from '../../../../../ModelContainer';
import * as api from '../../../../api';

export const get: Operation = async (req, res) => {
    const liveThumbnailModel = container.get<ILiveThumbnailModel>('ILiveThumbnailModel');

    try {
        const buffer = await liveThumbnailModel.getThumbnail(parseInt(req.params.channelId as string, 10));

        if (buffer === null) {
            api.responseError(res, {
                code: 503,
                message: 'thumbnail is not available',
            });

            return;
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', buffer.length);
        // 生成コストが高いので少しだけブラウザキャッシュさせる
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.status(200);
        res.end(buffer);
    } catch (err: any) {
        api.responseServerError(res, err.message);
    }
};

get.apiDoc = {
    summary: '放送中サムネイル',
    tags: ['streams'],
    description: '放送中チャンネルのサムネイル (静止画) を取得する',
    parameters: [
        {
            $ref: '#/components/parameters/PathChannelId',
        },
    ],
    responses: {
        200: {
            description: '放送中サムネイルを取得しました',
            content: {
                'image/jpeg': {},
            },
        },
        default: {
            description: '予期しないエラー',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error',
                    },
                },
            },
        },
    },
};
