import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { TABLET_MIN_WIDTH } from 'src/model/constant'
import styled from 'styled-components'

const MOBILE_HEADER_HEIGHT = '4rem'
const DESKTOP_HEADER_WIDTH = '7rem'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${DESKTOP_HEADER_WIDTH} 1fr;
  grid-template-rows: 1fr;

  @media (max-width: ${TABLET_MIN_WIDTH}) {
    grid-template-columns: 1fr;
    grid-template-rows: ${MOBILE_HEADER_HEIGHT} 1fr;
  }
`

const FixedPositionNav = styled.nav`
  position: fixed;
  left: 0;
  z-index: 1;

  display: grid;
  grid-template-rows: 1fr 1px 1fr 1px 1fr;
  grid-template-columns: 1fr;
  width: ${DESKTOP_HEADER_WIDTH};
  height: 100%;

  @media (max-width: ${TABLET_MIN_WIDTH}) {
    width: 100%;
    height: ${MOBILE_HEADER_HEIGHT};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
  }

  padding: 1rem;
  background: #326ce5;

  a {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    color: #fff;
  }
`

const HorizontalLine = styled.div`
  width: 100%;
  border-top: solid 1px #e0e0e0;

  @media (max-width: ${TABLET_MIN_WIDTH}) {
    border-left: solid 1px #e0e0e0;
    height: 100%;
  }
`

const Main = styled.main`
  grid-row: 1 / 2;
  grid-column: 2 / 3;

  @media (max-width: ${TABLET_MIN_WIDTH}) {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
  }
`

export const NavigationPadding = styled.div`
  width: 20vw;
  min-width: max-content;
  max-width: 10rem;
  height: 100vh;
`

type Props = {
  children: ReactNode
}

export default function NavigationLayout({ children }: Props) {
  const router = useRouter()

  function logout(e: any) {
    e.preventDefault()

    const result = confirm('로그아웃 하시겠습니까?')

    if (result) {
      globalThis.sessionStorage?.removeItem('jwt')
      router.push('/')
    }
  }

  return (
    <GridContainer>
      <FixedPositionNav>
        <Link href="/">홈</Link>
        <HorizontalLine />
        {globalThis.sessionStorage?.getItem('jwt') ? (
          <>
            <Link href="">
              <a onClick={logout}>로그아웃</a>
            </Link>
            <HorizontalLine />
            <Link href="/@">마이페이지</Link>
          </>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <HorizontalLine />
            <Link href="/register">회원가입</Link>
          </>
        )}
      </FixedPositionNav>
      <Main>{children}</Main>
    </GridContainer>
  )
}
