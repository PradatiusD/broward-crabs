import 'bootstrap/dist/css/bootstrap.css';
import "./../app/globals.css";
import React from "react";
function App({ Component, pageProps }) {
  return (
    <>
      <header>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand mx-auto" href="#">Flood Flow</a>
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