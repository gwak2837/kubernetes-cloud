export const MOBILE_MIN_WIDTH = '280px'
export const TABLET_MIN_WIDTH = '560px'
export const DESKTOP_MIN_WIDTH = '1024px'

export const PRIMARY_BACKGROUND_COLOR = '#326ce5' // manifest.json 파일의 theme_color 필드랑 일치

export const APPLICATION_SHORT_NAME = '쿠버네티스'
export const APPLICATION_NAME = '쿠버네티스 클라우드 최종 프로젝트'
export const CANONICAL_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : 'http://localhost:3000'
