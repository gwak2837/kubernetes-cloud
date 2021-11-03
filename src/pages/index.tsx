import { Button, Card } from 'antd'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
import PostCard from 'src/components/PostCard'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import NavigationLayout from 'src/layouts/NavigationLayout'
import PostLayout from 'src/layouts/PostLayout'
import styled from 'styled-components'

const GridContainer = styled.ul`
  display: grid;
  gap: 1rem;
`

const Right = styled.div`
  padding: 1rem 0;
  text-align: right;
`

const limit = 2

export default function HomePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage = true,
    isError,
    isFetching,
  } = useInfiniteQuery(
    'posts',
    async ({ pageParam = 0 }) => {
      const queryString = `limit=${limit}&offset=${pageParam}`
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post?${queryString}`)
      const posts = await response.json()
      if (posts.error) return []
      return posts
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return undefined
        return pages.length * limit
      },
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
    <>
      <Right>
        <Button onClick={goToPostCreationPage} size="large">
          글쓰기
        </Button>
      </Right>

      <GridContainer>
        {data?.pages
          .map((page) => page.map((post: any) => <PostCard key={post.id} post={post} />))
          .flat()}
        {isFetching && <Card loading={true} />}
      </GridContainer>

      {isError && <div>오류 발생</div>}
      {hasNextPage && <div ref={infiniteScrollRef}>무한 스크롤</div>}
    </>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <PostLayout>{page}</PostLayout>
    </NavigationLayout>
  )
}
