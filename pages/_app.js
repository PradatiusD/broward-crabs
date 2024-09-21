import 'bootstrap/dist/css/bootstrap.css';
import "./../app/globals.css";
import React from "react";
import logo from "./logo.svg";
import Image from "next/image";
import instagram from "./instagram.svg";
import twitter from "./twitter.svg";

function App({ Component, pageProps }) {
  return (
    <>
      <header>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand mx-auto" href="#"> <Image src={logo} alt="logo"/></a>
          </nav>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
        <footer className="d-flex p-2 justify-content-center">
            <div>
                contactus@floodflow.com
            </div>
            <div>
                <a><Image src={instagram}  alt="instagram logo"/></a>
                <a><Image src={twitter}  alt="instagram logo"/></a>
            </div>
        </footer>
    </>
  );
}

export default App;