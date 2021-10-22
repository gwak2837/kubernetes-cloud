import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { useMutation } from 'react-query'
import Navigation from 'src/components/Navigation'

import { digestMessageWithSHA256 } from '../utils'

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const mutation = useMutation(loginRequest, {
    onError: (error) => {
      alert(error)
    },
    onSuccess: (response) => {
      if (response.jwt) {
        globalThis.sessionStorage?.setItem('jwt', response.jwt)
        router.push('/')
      }
    },
  })

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const passwordHash = await digestMessageWithSHA256(password)
    mutation.mutate({ email, passwordHash })
  }

  return (
    <>
      <Navigation />
      <form onSubmit={login}>
        <label>
          이메일
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            type="email"
            value={email}
          />
        </label>
        <label>
          비밀번호
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={password}
          />
        </label>
        <button type="submit">로그인</button>
      </form>
    </>
  )
}

export default LoginPage
