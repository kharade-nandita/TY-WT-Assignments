import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Welcome from './components/Welcome.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import WorldClock from './components/WorldClock.jsx';
import './App.css'


function App() {
  return (
    <>
      <Header />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <WorldClock />
      </div>

      <Footer />
    </>
  );
}

export default App;
