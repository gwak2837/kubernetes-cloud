import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import styled from 'styled-components'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 8rem 1fr;
`

const FixedPositionNav = styled.nav`
  position: fixed;
  left: 0;
  z-index: 1;

  display: grid;
  grid-template-rows: 1fr 1px 1fr 1px 1fr;

  width: 8rem;
  height: 100%;
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
`

const Main = styled.main`
  grid-column: 2 / 3;
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

export default function Navigation({ children }: Props) {
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
    <>
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
    </>
  )
}
