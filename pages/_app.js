import '../styles/globals.css'
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {

  return (
       <div className={'h-screen'}>
        <Header />
        <Component {...pageProps} />
       </div>
       )

}

export default MyApp
