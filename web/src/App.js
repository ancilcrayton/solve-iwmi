import React from 'react';
import './App.css';
import Routes from './components/routes';
import { ParallaxProvider } from 'react-scroll-parallax';


const App = () => {
  return (
    <ParallaxProvider>
       <Routes />
    </ParallaxProvider>
  );
}

export default App;
