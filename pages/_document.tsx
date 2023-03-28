import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='zh-CN'>
      <Head>
        <link href='/favicons/favicon.ico' rel='shortcut icon' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicons/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicons/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
