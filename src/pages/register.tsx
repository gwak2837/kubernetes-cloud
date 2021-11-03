import { Button, Input } from 'antd'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { JWT, currentUserIdAtom } from 'src/model/recoil'
import { digestMessageWithSHA256 } from 'src/utils'
import styled from 'styled-components'

type RegisterFormValues = {
  email: string
  password: string
  passwordConfirm: string
}

export const validateEmail = {
  required: '필수 항목입니다.',
  maxLength: {
    value: 50,
    message: '최대 50글자 이하로 입력해주세요.',
  },
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: '이메일을 형식에 맞게 입력해주세요.',
  },
}

export const validatePassword = {
  required: '필수 항목입니다.',
  minLength: {
    value: 8,
    message: '최소 8글자 이상 입력해주세요.',
  },
}

export const GridContainerForm = styled.form`
  display: grid;
  gap: 1rem;

  margin: 0 auto;
  padding: 20vh 1rem;
  max-width: 400px;
`

export const Label = styled.h4`
  padding: 0 0.3rem 0.3rem;
`

export const RedText = styled.h5`
  color: #800000;
  padding: 0.3rem 0.3rem 0;
`

async function registerRequest(userInfo: Record<string, string>) {
  const jwt = sessionStorage.getItem('jwt')
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...((jwt && { Authorization: jwt }) as any),
    },
    body: JSON.stringify(userInfo),
  })
  return await response.json()
}

export default function RegisterPage() {
  const setCurrentUserId = useSetRecoilState(currentUserIdAtom)

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm<RegisterFormValues>({
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  })

  const validatePasswordConfirm = {
    required: '필수 항목입니다.',
    validate: {
      same: (passwordConfirm: string) =>
        passwordConfirm === getValues('password') || '비밀번호가 일치하지 않습니다.',
    },
  }

  const router = useRouter()

  const mutation = useMutation(registerRequest, {
    onError: (error) => {
      alert(error)
    },
    onSuccess: (response) => {
      if (response.jwt) {
        globalThis.sessionStorage?.setItem('jwt', response.jwt)
        setCurrentUserId(jwt_decode<JWT>(response.jwt).userId)
        router.push('/')
      }
    },
  })

  async function register({ email, password }: RegisterFormValues) {
    const passwordHash = await digestMessageWithSHA256(password)
    mutation.mutate({ email, passwordHash })
  }

  return (
    <GridContainerForm onSubmit={handleSubmit(register)}>
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
            <Input placeholder="비밀번호를 입력해주세요" size="large" type="password" {...field} />
          )}
          rules={validatePassword}
        />
        {errors.password && <RedText>{errors.password.message}</RedText>}
      </label>

      <label>
        <Label>비밀번호 확인</Label>
        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field }) => (
            <Input
              placeholder="비밀번호를 다시 입력해주세요"
              size="large"
              type="password"
              {...field}
            />
          )}
          rules={validatePasswordConfirm}
        />
        {errors.passwordConfirm && <RedText>{errors.passwordConfirm.message}</RedText>}
      </label>

      <Button htmlType="submit" size="large" type="primary">
        회원가입
      </Button>

      <Button onClick={() => router.push('/')} size="large">
        홈으로
      </Button>
    </GridContainerForm>
  )
}
