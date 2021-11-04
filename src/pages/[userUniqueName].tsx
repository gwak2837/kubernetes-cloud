import React, { ReactElement } from 'react'
import NavigationLayout from 'src/layouts/NavigationLayout'

export default function UserPage() {
  return <div>준비중입니다..</div>
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
