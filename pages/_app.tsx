import type { AppProps } from 'next/app';
import 'react-notion-x/src/styles.css';
import 'styles/global.css';
import 'styles/prism-themes/prism-one-dark.css';

export default function APP({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
