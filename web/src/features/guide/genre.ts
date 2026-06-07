// ARIB 大ジャンル (genre1: 0-15)
export const GENRE_NAMES: Record<number, string> = {
  0: 'ニュース/報道',
  1: 'スポーツ',
  2: '情報/ワイドショー',
  3: 'ドラマ',
  4: '音楽',
  5: 'バラエティ',
  6: '映画',
  7: 'アニメ/特撮',
  8: 'ドキュメンタリー/教養',
  9: '劇場/公演',
  10: '趣味/教育',
  11: '福祉',
  12: '予備',
  13: '予備',
  14: '拡張',
  15: 'その他',
}

// ジャンル別アクセントカラー(ライト/ダーク両方で映える彩度)
export const GENRE_COLORS: Record<number, string> = {
  0: '#3aa6b9',
  1: '#9aa83f',
  2: '#4f9fd6',
  3: '#e07a8b',
  4: '#6fae45',
  5: '#c558a6',
  6: '#dd6a3a',
  7: '#e98a4a',
  8: '#6168a8',
  9: '#5fa37e',
  10: '#2f8f88',
  11: '#4aa3e0',
  12: '#8a93a8',
  13: '#8a93a8',
  14: '#8a93a8',
  15: '#8a93a8',
}

const GENRE_FALLBACK = '#8a93a8'

/** 番組の主ジャンル (genre1 → genre2 → genre3) を返す */
export function primaryGenre(p: {
  genre1?: number
  genre2?: number
  genre3?: number
}): number | undefined {
  return p.genre1 ?? p.genre2 ?? p.genre3
}

export function genreColor(genre: number | undefined): string {
  return genre === undefined ? GENRE_FALLBACK : (GENRE_COLORS[genre] ?? GENRE_FALLBACK)
}

export function genreName(genre: number | undefined): string | undefined {
  return genre === undefined ? undefined : GENRE_NAMES[genre]
}

/** hex(#rrggbb) を rgba 文字列にする */
export function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
