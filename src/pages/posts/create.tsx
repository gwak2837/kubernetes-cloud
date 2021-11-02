import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { useMutation } from 'react-query'
import Navigation from 'src/components/Navigation'
import NavigationLayout from 'src/layouts/NavigationLayout'

async function postCreationRequest(post: Record<string, unknown>) {
  const jwt = sessionStorage.getItem('jwt')
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...((jwt && { Authorization: jwt }) as any),
    },
    body: JSON.stringify(post),
  })
  return await response.json()
}

export default function PostCreationPage() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')

  const router = useRouter()

  const { mutate } = useMutation(postCreationRequest, {
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (response) => {
      if (response.postId) {
        console.log(response.postId)
        router.push('/')
      }
    },
  })

  function createPost() {
    mutate({ title, contents })
  }

  return (
    <div>
      <h2>글 쓰기</h2>

      <label htmlFor="title">제목</label>
      <input
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요"
        value={title}
      />

      <label htmlFor="contents">내용</label>
      <textarea
        name="contents"
        onChange={(e) => setContents(e.target.value)}
        placeholder="제목을 입력해주세요"
        value={contents}
      />

      <button onClick={createPost}>등록하기</button>
    </div>
  )
}

PostCreationPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
