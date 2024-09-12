import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>MALITE 2</title>
                <link rel="shortcut-icon" href="/img/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
            </Head>
            <Script src="https://kit.fontawesome.com/d5730f9cf6.js" crossOrigin="anonymous"></Script>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
