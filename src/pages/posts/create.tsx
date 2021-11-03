import { Button, Input } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import NavigationLayout from 'src/layouts/NavigationLayout'
import PostLayout from 'src/layouts/PostLayout'
import { RedText } from 'src/pages/register'
import styled from 'styled-components'

const { TextArea } = Input

type PostCreationFormValues = {
  title: string
  contents: string
}

const Padding = styled.div`
  padding-top: 1rem;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  gap: 1rem;

  padding: 1rem 0;
`

export const validateTitle = {
  required: '제목은 필수입니다.',
  maxLength: {
    value: 100,
    message: '최대 100글자 이하로 입력해주세요.',
  },
}

export const validateContents = {
  required: '내용은 필수입니다.',
}

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
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PostCreationFormValues>({
    defaultValues: { title: '', contents: '' },
  })

  const router = useRouter()

  const { mutate, isLoading } = useMutation(postCreationRequest, {
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

  function createPost({ title, contents }: PostCreationFormValues) {
    mutate({ title, contents })
  }

  return (
    <form onSubmit={handleSubmit(createPost)}>
      <GridContainer>
        <div />
        <Button loading={isLoading} onClick={() => reset()} size="large">
          초기화
        </Button>
        <Button htmlType="submit" loading={isLoading} size="large">
          등록하기
        </Button>
      </GridContainer>

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Input
            allowClear
            disabled={isLoading}
            placeholder="제목을 입력해주세요"
            size="large"
            {...field}
          />
        )}
        rules={validateTitle}
      />
      {errors.title && <RedText>{errors.title.message}</RedText>}

      <Padding />

      <Controller
        control={control}
        name="contents"
        render={({ field }) => (
          <TextArea
            allowClear
            autoSize={{ minRows: 5, maxRows: 20 }}
            disabled={isLoading}
            placeholder="내용을 입력해주세요"
            rows={10}
            showCount
            {...field}
          />
        )}
        rules={validateContents}
      />
      {errors.contents && <RedText>{errors.contents.message}</RedText>}
    </form>
  )
}

PostCreationPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <PostLayout>{page} </PostLayout>
    </NavigationLayout>
  )
}
