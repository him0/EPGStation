import { useEffect, useState } from 'react'

/**
 * 現在時刻 (ms) を一定間隔で更新して返すフック。
 * 放送中番組の進捗バーをライブで進めるために使う。
 */
export function useNow(intervalMs = 30 * 1000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
