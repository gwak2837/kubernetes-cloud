import Link from 'next/link'
import { useRouter } from 'next/router'

function Navigation() {
  const router = useRouter()

  function logout() {
    globalThis.sessionStorage?.removeItem('jwt')
    router.push('/')
  }

  return (
    <nav>
      <Link href="/">홈 </Link>
      <Link href="/posts">글 </Link>
      {globalThis.sessionStorage?.getItem('jwt') ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <>
          <Link href="/login">로그인 </Link>
          <Link href="/register">회원가입 </Link>
        </>
      )}
    </nav>
  )
}

export default Navigation
