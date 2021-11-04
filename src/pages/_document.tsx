/* eslint-disable react/no-danger */
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { APPLICATION_SHORT_NAME, CANONICAL_URL, PRIMARY_BACKGROUND_COLOR } from 'src/model/constant'
import { ServerStyleSheet } from 'styled-components'

const keywords = `${APPLICATION_SHORT_NAME},쿠버네티스,클라우드,엔지니어,최종프로젝트`
const subject = '쿠버네티스 기반 클라우드 엔지니어 양성 과정 최종 프로젝트'
const title = '쿠버네티스 기반 클라우드 엔지니어 양성 과정 최종 프로젝트'
const description = '쿠버네티스 기반 클라우드 엔지니어 양성 과정 최종 프로젝트'

export default class SobokDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <base href={CANONICAL_URL} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href="favicon.ico" />
          <link rel="icon" href="favicon.ico" />
          <link rel="canonical" href={CANONICAL_URL} />
          <link rel="manifest" href="manifest.json" />
          <link rel="apple-touch-icon" href="favicon.ico" />
          <meta name="author" content="gwak2837" />
          <meta name="keywords" content={keywords} />
          <meta name="application-name" content={APPLICATION_SHORT_NAME} />
          <meta name="theme-color" content={PRIMARY_BACKGROUND_COLOR} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content={APPLICATION_SHORT_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="generator" content="Next.js 11" />
          <meta name="subject" content={subject} />
          <meta name="rating" content="general" />
          <meta name="robots" content="index,follow" />
          <meta name="revisit-after" content="7 days" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="/images/og-image.jpg" />
          <meta property="og:image:alt" content="/images/og-image.jpg" />
          <meta property="og:site_name" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="ko_KR" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image:alt" content="Sobok Logo" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
