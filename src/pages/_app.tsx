import 'antd/dist/antd.css'
import 'normalize.css'
import 'src/styles/globals.css'

import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'

const queryClient = new QueryClient()

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

function KubernetesCloudApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout

  useEffect(() => {
    console.log('👀 - process.env.NEXT_PUBLIC_BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        {getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default KubernetesCloudApp
