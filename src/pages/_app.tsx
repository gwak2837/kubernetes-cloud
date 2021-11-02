import 'antd/dist/antd.css'
import 'normalize.css'
import 'src/styles/globals.css'

import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout

  useEffect(() => {
    console.log('👀 - process.env.NEXT_PUBLIC_BACKEND_URL', process.env.NEXT_PUBLIC_BACKEND_URL)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
    </QueryClientProvider>
  )
}

export default MyApp
