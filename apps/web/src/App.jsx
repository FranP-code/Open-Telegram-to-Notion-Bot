import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Header from './components/Header/Header'

import Auth from './Pages/Auth'
import Index from './Pages/Index/Index'

function App() {
  return (
    <>
    <Header />
    <Router>
      <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/" element={<Index/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;