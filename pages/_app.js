import 'bootstrap/dist/css/bootstrap.css';
import "./../app/globals.css";
import React from "react";
import logo from './logo.svg';
import Image from "next/image";

function App({ Component, pageProps }) {
  return (
    <>
      <header>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand mx-auto" href="#"> <Image src={logo} /></a>
          </nav>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;