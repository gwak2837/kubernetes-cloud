import React, { ReactElement } from 'react'
import NavigationLayout from 'src/layouts/NavigationLayout'
import styled from 'styled-components'

const Padding = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 50rem;
`

const H2 = styled.h2`
  text-align: center;
  margin: 1rem;
`

const Table = styled.table`
  width: 100%;

  td {
    text-align: center;
    padding: 0.5rem;
  }
`

const Line = styled.div`
  margin: 2rem 1rem;
  border: 0.5px solid black;
`

const GridContainerGap = styled.div`
  display: grid;
  gap: 1rem;

  padding: 0 1rem;
  font-size: 0.8rem;
  color: #6c6c6c;
`

export default function AboutPage() {
  return (
    <Padding>
      <H2>팀 소개</H2>

      <Table>
        <thead>
          <tr>
            <td>이름</td>
            <td>GitHub</td>
            <td>역할</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>곽태욱</td>
            <td>
              <a href="https://github.com/rmfpdlxmtidl" target="_blank" rel="noreferrer">
                @rmfpdlxmtidl
              </a>
            </td>
            <td>프론트엔드, 백엔드</td>
          </tr>
          <tr>
            <td>박정우</td>
            <td>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                @
              </a>
            </td>
            <td>마이그레이션, CI/CD</td>
          </tr>
          <tr>
            <td>성준</td>
            <td>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                @
              </a>
            </td>
            <td>문서화</td>
          </tr>
          <tr>
            <td>허상</td>
            <td>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                @
              </a>
            </td>
            <td>SSL, HTTPS</td>
          </tr>
        </tbody>
      </Table>

      <Line />

      <footer>
        <GridContainerGap>
          <h3>Copyright © {new Date().getUTCFullYear()} 이조오조, Inc. All rights reserved.</h3>
          <div>
            <div>
              <b>이조오조</b>
            </div>
            <div>
              <b>주소 :</b> 서울특별시 서초구 서초중앙로20길 23
            </div>
            <div>
              <b>E-mail :</b> gwak2837@kakao.com
            </div>
            <div>
              <b>고객센터 :</b> 010-9203-2837
            </div>
            <div>평일 09~18시 (점심시간 12~13시), 주말/공휴일 휴무</div>
          </div>
        </GridContainerGap>
      </footer>
    </Padding>
  )
}

AboutPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
