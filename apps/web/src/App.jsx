import React from 'react'
import {Route} from 'wouter'

import Header from './components/Header/Header'

import Auth from './Pages/Auth/Auth'
import Index from './Pages/Index/Index'

function App() {
  return (
    <>
      <Header />
      <Route path="/auth" children={<Auth/>} />
      <Route path="/" children={<Index/>} />
    </>
  );
}

export default App;