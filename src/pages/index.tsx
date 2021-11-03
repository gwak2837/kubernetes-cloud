import { Card } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
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

const GridContainer = styled.ul`
  display: grid;
  gap: 1rem;

  margin: 1rem 0;
`

const limit = 2

export default function HomePage() {
  const {
    data,
    hasNextPage = true,
    isLoading,
    isError,
    fetchNextPage,
  } = useInfiniteQuery(
    'posts',
    async ({ pageParam = 0 }) => {
      const queryString = `limit=${limit}&offset=${pageParam}`
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post?${queryString}`)
      return await response.json()
    },
    {
      getNextPageParam: (lastPage) => lastPage[limit - 1]?.id,
    }
  )

  const router = useRouter()

  const infiniteScrollRef = useInfiniteScroll({
    hasMoreData: hasNextPage,
    onIntersecting: () => {
      fetchNextPage()
    },
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

      <GridContainer>
        {data?.pages
          .map((page) =>
            page.map((post: any) => (
              <Card key={post.id}>
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
                <div>{new Date(post.creationTime).toLocaleDateString()}</div>
              </Card>
            ))
          )
          .flat()}
      </GridContainer>

      {isLoading && <div>Loading...</div>}
      {isError && <div>오류 발생</div>}
      {hasNextPage && <div ref={infiniteScrollRef}>무한 스크롤</div>}
    </Padding>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
