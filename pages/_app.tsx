import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
      <title>Player de Vídeo</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
       
      </Head>
      <Script src="/scripts/script.js"></Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
