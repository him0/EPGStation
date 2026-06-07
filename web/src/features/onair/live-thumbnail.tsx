import { Loader2, RefreshCw, Tv } from 'lucide-react'
import { useState } from 'react'

import { genreColor, hexAlpha } from '@/features/guide/genre'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'loaded' | 'error'

type Props = {
  channelId: number
  genre?: number
}

/**
 * 放送中チャンネルのサムネイル。
 * 取得はチューナーを消費するため、明示操作があったときだけ読み込む:
 *   - PC: ホバー (onMouseEnter) で 1 回だけ取得
 *   - モバイル: タップ (onClick) で取得 / 再取得
 * 読み込み済みのものはクリックで強制リフレッシュできる。
 */
export function LiveThumbnail({ channelId, genre }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [src, setSrc] = useState<string>()

  const load = (force: boolean): void => {
    if (status === 'loading') return
    if (status === 'loaded' && force === false) return
    setStatus('loading')
    // キャッシュ回避のためタイムスタンプを付ける
    setSrc(`/api/streams/live/${channelId}/thumbnail?t=${Date.now()}`)
  }

  const color = genreColor(genre)

  return (
    <div
      className="group bg-muted relative aspect-video w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, ${hexAlpha(color, 0.25)}, ${hexAlpha(color, 0.05)})`,
      }}
      onMouseEnter={() => load(false)}
      onClick={e => {
        // カード本体の詳細表示を抑止してサムネ取得だけ行う
        e.stopPropagation()
        load(true)
      }}
    >
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}

      {status === 'idle' && (
        <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-1">
          <Tv className="size-6 opacity-60" />
          <span className="text-[10px]">ホバー / タップでプレビュー</span>
        </div>
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}

      {status === 'error' && (
        <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-1">
          <RefreshCw className="size-5 opacity-70" />
          <span className="text-[10px]">取得できませんでした(タップで再試行)</span>
        </div>
      )}

      {status === 'loaded' && (
        <div className="absolute top-1.5 right-1.5 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <RefreshCw className="size-3.5" />
        </div>
      )}
    </div>
  )
}
