import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useQuery } from 'react-query'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import NavigationLayout from 'src/layouts/NavigationLayout'
import styled from 'styled-components'

const BlueH2 = styled.h2`
  background: #2496ed;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
`

const Padding = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 50rem;
`

const limit = 3

export default function HomePage() {
  const [pageIndex, setPageIndex] = useState(1)

  async function postsRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit, offset: pageIndex - 1 }),
    })
    return await response.json()
  }

  const { data, isLoading, isError } = useQuery('posts', postsRequest)

  const router = useRouter()

  const infiniteScrollRef = useInfiniteScroll({
    onIntersecting: () => 1,
    hasMoreData: false,
  })

  function goToPostCreationPage() {
    if (!globalThis.sessionStorage?.getItem('jwt')) {
      alert('로그인이 필요합니다.')
      return
    }

    router.push('/posts/create')
  }

  return (
    <Padding>
      <BlueH2>쿠버네티스 기반의 클라우드시스템 엔지니어 양성과정</BlueH2>
      <button onClick={goToPostCreationPage}>글쓰기</button>
      <ul>
        {!data?.message &&
          data?.map((post: any) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
              <div>{new Date(post.creationTime).toLocaleDateString()}</div>
            </li>
          ))}
      </ul>

      {isLoading && <div>Loading...</div>}
      {isError && <div>오류 발생</div>}
      {isError && <div ref={infiniteScrollRef}>오류 발생</div>}
    </Padding>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
