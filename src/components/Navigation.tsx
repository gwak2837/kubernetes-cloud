import { Button } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const FixedPositionNav = styled.nav`
  position: fixed;
  top: 0;
  z-index: 1;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: center;

  width: 100%;
  padding: 1rem;

  a {
    width: 100%;
    text-align: center;
  }
`

export const NavigationPadding = styled.div`
  padding-top: 56px;
`

function Navigation() {
  const router = useRouter()

  function logout() {
    globalThis.sessionStorage?.removeItem('jwt')
    router.push('/')
  }

  return (
    <>
      <FixedPositionNav>
        <Link href="/">홈</Link>
        <Link href="/posts">글</Link>
        {globalThis.sessionStorage?.getItem('jwt') ? (
          <Button onClick={logout} size="large">
            로그아웃
          </Button>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/register">회원가입</Link>
          </>
        )}
      </FixedPositionNav>
      <NavigationPadding />
    </>
  )
}

export default Navigation
