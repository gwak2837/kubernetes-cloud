import { ReactNode } from 'react'
import styled from 'styled-components'

const BlueH2 = styled.h2`
  background: #2496ed;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
`

const Padding = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 50rem;
`

type Props = {
  children: ReactNode
}

export default function PostLayout({ children }: Props) {
  return (
    <Padding>
      <BlueH2>쿠버네티스 기반의 클라우드 시스템 엔지니어 양성과정</BlueH2>
      {children}
    </Padding>
  )
}
