import { Button, Card } from 'antd'
import jwt_decode from 'jwt-decode'
import Link from 'next/link'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import styled from 'styled-components'

const AbsolutePositionButton = styled(Button)`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
`

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

type Props = {
  post: any
}

function PostCard({ post }: Props) {
  const [myUserId, setMyUserId] = useState('')

  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(postDeletionRequest, {
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (response) => {
      if (response.postId) {
        queryClient.invalidateQueries('posts')
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

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt')
    if (jwt) {
      setMyUserId(jwt_decode<any>(jwt).userId)
    }
  }, [])

  return (
    <Card
      bodyStyle={{ padding: '1rem', position: 'relative', cursor: 'pointer' }}
      onClick={() => router.push(`/posts/${post.id}`)}
    >
      <Link href={`/posts/${post.id}`} passHref>
        <a>
          {post.id} <h3>{post.title}</h3>
        </a>
      </Link>
      <div>{new Date(post.creationTime).toLocaleDateString()}</div>
      <AbsolutePositionButton
        danger
        disabled={myUserId !== post.userId}
        loading={isLoading}
        onClick={(e) => {
          e.stopPropagation()
          deletePost(post.id)
        }}
      >
        <h5 style={{ color: 'inherit' }}>삭제</h5>
      </AbsolutePositionButton>
    </Card>
  )
}

export default PostCard
