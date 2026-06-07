import { useMemo } from 'react'

import { useGetReservesLists } from '@/api/generated/endpoints'
import type { ReserveListItem } from '@/api/generated/model'

export type ReserveType = 'reserve' | 'conflict' | 'skip' | 'overlap'

// OpenAPI 定義では単数だが、実レスポンスは配列で返る
type ReserveListsArrays = {
  normal: ReserveListItem[]
  conflicts: ReserveListItem[]
  skips: ReserveListItem[]
  overlaps: ReserveListItem[]
}

/**
 * 指定期間の予約一覧を取得し、programId → 予約種別 の Map を返す。
 * 番組表セルのオーバーレイ表示に使う。
 */
export function useReserveMap(startAt: number, endAt: number): Map<number, ReserveType> {
  const query = useGetReservesLists({ startAt, endAt })

  return useMemo(() => {
    const map = new Map<number, ReserveType>()
    if (query.data?.status !== 200) return map

    const lists = query.data.data as unknown as ReserveListsArrays
    const apply = (items: ReserveListItem[], type: ReserveType) => {
      for (const r of items) {
        if (r.programId !== undefined) map.set(r.programId, type)
      }
    }
    // overlap/skip/conflict が normal を上書きする想定で順に適用
    apply(lists.normal, 'reserve')
    apply(lists.conflicts, 'conflict')
    apply(lists.skips, 'skip')
    apply(lists.overlaps, 'overlap')
    return map
  }, [query.data])
}
