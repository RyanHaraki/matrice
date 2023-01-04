import "../styles/globals.css";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser(null);
    }
  }, [router.asPath]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
      <Wrapper>
        <div className={"h-screen"}>
          {user && <Header userData={user} />}
          <Component {...pageProps} />
        </div>
      </Wrapper>
    </>
  );
}

export default MyApp;
