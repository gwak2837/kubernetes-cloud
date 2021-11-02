import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useQuery } from 'react-query'
import NavigationLayout from 'src/layouts/NavigationLayout'

export default function PostPage() {
  const router = useRouter()
  const postId = (router.query.id ?? '') as string

  async function postRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${postId}`)
    return await response.json()
  }

  const { data, isLoading, isError } = useQuery(`post-${postId}`, postRequest)

  return (
    <div>
      {isLoading ? (
        <div>Loading</div>
      ) : isError ? (
        <div>오류 발생</div>
      ) : (
        <>
          <h3>{data.title}</h3>
          <p>{data.contents}</p>
        </>
      )}
    </div>
  )
}

PostPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
