import { Button, Input } from 'antd'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import Navigation from 'src/components/Navigation'
import styled from 'styled-components'

import { digestMessageWithSHA256 } from '../utils'
import { GridContainerForm, Label, RedText, validateEmail, validatePassword } from './register'

type LoginFormValues = {
  email: string
  password: string
}

async function loginRequest(userInfo: Record<string, string>) {
  const jwt = sessionStorage.getItem('jwt')

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...((jwt && { Authorization: jwt }) as any),
    },
    body: JSON.stringify(userInfo),
  })
  return await response.json()
}

const LoginPage: NextPage = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  })

  const router = useRouter()

  const mutation = useMutation(loginRequest, {
    onError: (error) => {
      alert(error)
    },
    onSuccess: (response) => {
      if (response.jwt) {
        globalThis.sessionStorage?.setItem('jwt', response.jwt)
        router.push('/')
      } else if (response.message) {
        alert(response.message)
      }
    },
  })

  async function login({ email, password }: LoginFormValues) {
    const passwordHash = await digestMessageWithSHA256(password)
    mutation.mutate({ email, passwordHash })
  }

  return (
    <>
      <Navigation />

      <GridContainerForm onSubmit={handleSubmit(login)}>
        <label>
          <Label>이메일</Label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input placeholder="이메일을 입력해주세요" size="large" type="email" {...field} />
            )}
            rules={validateEmail}
          />
          {errors.email && <RedText>{errors.email.message}</RedText>}
        </label>

        <label>
          <Label>비밀번호</Label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                placeholder="비밀번호를 입력해주세요"
                size="large"
                type="password"
                {...field}
              />
            )}
            rules={validatePassword}
          />
          {errors.password && <RedText>{errors.password.message}</RedText>}
        </label>

        <Button htmlType="submit" size="large" type="primary">
          로그인
        </Button>
      </GridContainerForm>
    </>
  )
}

export default LoginPage
