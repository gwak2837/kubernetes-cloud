import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { useMutation } from 'react-query'
import Navigation from 'src/components/Navigation'
import { digestMessageWithSHA256 } from 'src/utils'

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

const RegisterPage: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const router = useRouter()

  const mutation = useMutation(registerRequest, {
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

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    const passwordHash = await digestMessageWithSHA256(password)
    mutation.mutate({ email, passwordHash })
  }

  return (
    <>
      <Navigation />

      <form onSubmit={register}>
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
        <label>
          비밀번호 확인
          <input
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            type="password"
            value={passwordConfirm}
          />
        </label>
        <button type="submit">회원가입</button>
      </form>
    </>
  )
}

export default RegisterPage
