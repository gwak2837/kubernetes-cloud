import { Button, Input } from 'antd'
import { Card } from 'antd'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import NavigationLayout from 'src/layouts/NavigationLayout'
import PostLayout from 'src/layouts/PostLayout'
import styled from 'styled-components'

import { RedText } from '../register'
import { validateContents, validateTitle } from './create'

const { TextArea } = Input

type PostUpdateFormValues = {
  title: string
  contents: string
}

const AlignRright = styled.div`
  text-align: right;
  padding: 1rem 0;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  gap: 1rem;

  padding: 1rem 0;
`

export default function PostPage() {
  const router = useRouter()
  const postId = (router.query.id ?? '') as string

  const { data, isLoading, isError } = useQuery(`post-${postId}`, postRequest)

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<PostUpdateFormValues>()

  async function postRequest() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${postId}`)
    return await response.json()
  }

  return (
    <div>
      <GridContainer>
        <div />
        <Button
          loading={isLoading}
          onClick={() => reset({ title: data.title, contents: data.contents })}
          size="large"
        >
          초기화
        </Button>
        <Button loading={isLoading} htmlType="submit" size="large">
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
                disabled={isLoading}
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
                disabled={isLoading}
                placeholder="내용을 입력해주세요"
                rows={10}
                showCount={false}
                {...field}
              />
            )}
            rules={validateContents}
          />
          {errors.contents && <RedText>{errors.contents.message}</RedText>}
        </>
      )}
    </div>
  )
}

PostPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <NavigationLayout>
      <PostLayout>{page}</PostLayout>
    </NavigationLayout>
  )
}
