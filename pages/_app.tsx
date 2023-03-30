import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import 'react-notion-x/src/styles.css';
import 'styles/global.css';
import 'styles/notion.css';
import 'styles/prism.css';

export default function APP({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
