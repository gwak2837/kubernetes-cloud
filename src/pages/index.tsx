import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Navigation from 'src/components/Navigation'

async function postsRequest() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post`)
  return await response.json()
}

const HomePage: NextPage = () => {
  const { data, isLoading, isError } = useQuery('posts', postsRequest)
  console.log('👀 - query', data)

  const router = useRouter()

  function goToPostCreationPage() {
    if (!globalThis.sessionStorage?.getItem('jwt')) {
      alert('로그인이 필요합니다.')
      return
    }

    router.push('/posts/create')
  }

  return (
    <div>
      <Navigation />
      <h2>글 목록</h2>
      <button onClick={goToPostCreationPage}>글쓰기</button>
      <ul>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>오류 발생</div>
        ) : (
          data.map((post: any) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default HomePage
