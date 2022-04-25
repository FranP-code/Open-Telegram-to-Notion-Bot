import React from 'react'
import {Route} from 'wouter'

//Components
import Header from './components/Header/Header'

//Pages
import About from './Pages/About/About'
import Auth from './Pages/Auth/Auth'
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy'
import TermsOfUse from './Pages/TermsOfUse/TermsOfUse'
import Index from './Pages/Index/Index'

function App() {
  return (
    <>
      <Header />
      <Route path="/about" children={<About/>} />
      <Route path="/auth" children={<Auth/>} />
      <Route path="/privacy-policy" children={<PrivacyPolicy/>} />
      <Route path="/terms-of-use" children={<TermsOfUse/>} />
      <Route path="/" children={<Index/>} />
    </>
  );
}

export default App;