import { Button, Input } from 'antd'
import { Card } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'
import NavigationLayout from 'src/layouts/NavigationLayout'
import PostLayout from 'src/layouts/PostLayout'
import { currentUserIdAtom } from 'src/model/recoil'
import styled from 'styled-components'

import { RedText } from '../register'
import { validateContents, validateTitle } from './create'

const { TextArea } = Input

type PostUpdateFormValues = {
  title: string
  contents: string
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  gap: 1rem;

  padding: 1rem 0;
`

async function postUpdateRequest(post: Record<string, unknown>) {
  const jwt = sessionStorage.getItem('jwt')
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${post.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt && { Authorization: jwt }),
    },
    body: JSON.stringify(post),
  })
  return await response.json()
}

export default function PostPage() {
  const currentUserId = useRecoilValue(currentUserIdAtom)
  const queryClient = useQueryClient()
  const router = useRouter()
  const postId = (router.query.id ?? '') as string

  const { data, isLoading, isError } = useQuery(`post-${postId}`, postRequest)

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PostUpdateFormValues>()

  const { mutate, isLoading: isUpdateLoading } = useMutation(postUpdateRequest, {
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (response) => {
      if (response) {
        reset({ title: response.title, contents: response.contents })
        queryClient.invalidateQueries(`post-${postId}`)
      }
    },
  })

  async function postRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${postId}`)
    return await response.json()
  }

  function updatePost({ title, contents }: PostUpdateFormValues) {
    mutate({ id: data.id, title, contents })
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      <GridContainer>
        <div />
        <Button
          disabled={currentUserId !== data?.userId}
          loading={isLoading || isUpdateLoading}
          onClick={() => reset({ title: data.title, contents: data.contents })}
          size="large"
        >
          초기화
        </Button>
        <Button
          disabled={currentUserId !== data?.userId}
          loading={isLoading || isUpdateLoading}
          htmlType="submit"
          size="large"
        >
          수정하기
        </Button>
      </GridContainer>

      {isLoading ? (
        <Card loading>Loading</Card>
      ) : isError ? (
        <div>오류 발생</div>
      ) : (
        <>
          <Controller
            control={control}
            defaultValue={data.title}
            name="title"
            render={({ field }) => (
              <Input
                allowClear={false}
                bordered={false}
                disabled={isLoading || isUpdateLoading}
                placeholder="제목을 입력해주세요"
                size="large"
                {...field}
              />
            )}
            rules={validateTitle}
          />
          {errors.title && <RedText>{errors.title.message}</RedText>}

          <Controller
            control={control}
            defaultValue={data.contents}
            name="contents"
            render={({ field }) => (
              <TextArea
                allowClear={false}
                autoSize={{ minRows: 5, maxRows: 20 }}
                bordered={false}
                disabled={isLoading || isUpdateLoading}
                placeholder="내용을 입력해주세요"
                rows={10}
                size="large"
                showCount={false}
                {...field}
              />
            )}
            rules={validateContents}
          />
          {errors.contents && <RedText>{errors.contents.message}</RedText>}
        </>
      )}
    </form>
  )
}

PostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <PostLayout>{page}</PostLayout>
    </NavigationLayout>
  )
}
