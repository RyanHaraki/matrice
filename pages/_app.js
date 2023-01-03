import "../styles/globals.css";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../components/Wrapper";

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
    <Wrapper>
      <div className={"h-screen"}>
        {user && <Header />}
        <Component {...pageProps} />
      </div>
    </Wrapper>
  );
}

export default MyApp;
