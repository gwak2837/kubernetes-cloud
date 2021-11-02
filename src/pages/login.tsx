import { Button, Input } from 'antd'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import Checkbox from 'src/components/Checkbox'
import Navigation from 'src/components/Navigation'
import EmailIcon from 'src/svgs/EmailIcon'
import PasswordIcon from 'src/svgs/PasswordIcon'
import SobokLogo from 'src/svgs/sobok-logo.svg'
import styled from 'styled-components'

import { digestMessageWithSHA256 } from '../utils'
import { GridContainerForm, Label, RedText, validateEmail, validatePassword } from './register'

const Padding = styled.div`
  padding: 1rem;
  background: #fcfcfc;
  height: 100vh;
  max-width: 400px;
  margin: 0 auto;
`

const Padding1 = styled.div`
  padding: 1rem 0;
  text-align: right;
`

const Padding4 = styled.div`
  padding-top: 4rem;
  text-align: right;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr 1px 1fr;
  place-items: center center;
  gap: 0.5rem 0;

  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: solid 1px #e0e0e0;
  background: #fff;
`

const LogoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr 0.5fr;

  svg {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    width: 100%; // for safari
    cursor: pointer;
  }
`

const BlackText = styled.span`
  color: black;
  cursor: pointer;
  padding: 0.5rem;
`

const EmailIconWraptper = styled.div`
  width: 1.5rem;

  svg {
    display: block;
    margin: auto;
  }
`

const PasswordIconWraptper = styled.div`
  width: 1rem;

  svg {
    display: block;
    margin: auto;
  }
`

const HorizontalLine = styled.div`
  width: 100%;

  grid-column: 1 / 3;
  border-top: solid 1px #e0e0e0;
`

const StyledButton = styled(Button)`
  height: 3.5rem;
  width: 100%;
`

const CenterText = styled.div`
  text-align: center;
`

type LoginFormValues = {
  email: string
  password: string
  remember: boolean
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
    watch,
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', remember: false },
  })

  const router = useRouter()

  const { mutate, isLoading } = useMutation(loginRequest, {
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
    mutate({ email, passwordHash })
  }

  return (
    <Padding>
      <LogoWrapper>
        <SobokLogo onClick={() => router.push('/')} />
      </LogoWrapper>

      <form onSubmit={handleSubmit(login)}>
        <GridContainer>
          <EmailIconWraptper>
            <EmailIcon colored={Boolean(watch('email'))} />
          </EmailIconWraptper>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input bordered={false} placeholder="이메일을 입력해주세요" size="large" {...field} />
            )}
            rules={validateEmail}
          />

          <HorizontalLine />

          <PasswordIconWraptper>
            <PasswordIcon colored={Boolean(watch('password'))} />
          </PasswordIconWraptper>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                bordered={false}
                placeholder="쿠버네티스 마스터가 되자"
                size="large"
                type="password"
                {...field}
              />
            )}
            rules={validatePassword}
          />
        </GridContainer>

        <RedText>{errors.email?.message || errors.password?.message}</RedText>

        <Padding1>
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox checked={field.value} disabled={isLoading} {...field}>
                로그인 유지
              </Checkbox>
            )}
          />
        </Padding1>

        <StyledButton loading={isLoading} htmlType="submit" size="large" type="primary">
          로그인
        </StyledButton>

        <Padding4 />

        <StyledButton loading={isLoading} htmlType="submit" size="large">
          간편 로그인
        </StyledButton>

        <Padding1 />

        <CenterText>
          <Link href="/register" passHref>
            <a>
              <BlackText>회원가입</BlackText>
            </a>
          </Link>
          <Link href="/register" passHref>
            <a>
              <BlackText>아이디/비밀번호 찾기</BlackText>
            </a>
          </Link>
        </CenterText>
      </form>
    </Padding>
  )
}

export default LoginPage
