import { Button, Card } from 'antd'
import jwt_decode from 'jwt-decode'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
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

const AbsolutePositionButton = styled(Button)`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
`

const limit = 2

async function postDeletionRequest(postId: string) {
  const jwt = sessionStorage.getItem('jwt')
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...((jwt && { Authorization: jwt }) as any),
    },
  })
  return await response.json()
}

export default function HomePage() {
  const [myUserId, setMyUserId] = useState('')

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

  const queryClient = useQueryClient()

  const { mutate } = useMutation(postDeletionRequest, {
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (response) => {
      if (response.postId) {
        queryClient.invalidateQueries('posts')
        console.log(response.postId)
        router.push('/')
      }
    },
  })

  function deletePost(postId: string) {
    const result = confirm('정말로 삭제하시겠습니까?')
    if (result) {
      mutate(postId)
    }
  }

  function goToPostCreationPage() {
    if (!globalThis.sessionStorage?.getItem('jwt')) {
      alert('로그인이 필요합니다.')
      return
    }
    router.push('/posts/create')
  }

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt')
    if (jwt) {
      setMyUserId(jwt_decode<any>(jwt).userId)
    }
  }, [])

  return (
    <>
      <Right>
        <Button onClick={goToPostCreationPage} size="large">
          글쓰기
        </Button>
      </Right>

      <GridContainer>
        {data?.pages
          .map((page) =>
            page.map((post: any) => (
              <Link key={post.id} href={`/posts/${post.id}`} passHref>
                <a>
                  <Card bodyStyle={{ padding: '1rem', position: 'relative' }}>
                    {post.id} <h3>{post.title}</h3>
                    <div>{new Date(post.creationTime).toLocaleDateString()}</div>
                    <AbsolutePositionButton
                      danger
                      disabled={myUserId !== post.userId}
                      onClick={() => deletePost(post.id)}
                      size="small"
                    >
                      <h5 style={{ color: 'inherit' }}>삭제</h5>
                    </AbsolutePositionButton>
                  </Card>
                </a>
              </Link>
            ))
          )
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
