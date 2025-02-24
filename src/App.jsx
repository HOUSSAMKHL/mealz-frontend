import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import './App.css';
import Nav from '../src/Components/Navbar/Nav';
import Home from '../src/Components/Home/Home';
import About from '../src/Components/About/About';
import Contact from '../src/Components/Contact/Contact';
import Footer from './Components/footer/Footer';
import Menu from './Components/menu/Menu';
import Commander from './Components/commander/Commander';
import LoginSignup from './Components/login/LoginSignup';
import Dashboard from '../src/Components/Dashboard/Dashboard';

function App() {

  return (
        <div>
          <Router>
            <Routes>
              <Route path="/LoginSignup" element={<LoginSignup />} />
              <Route path="/Menu" element={<Menu />} />
              <Route path="/Commander" element={<Commander />} />
              <Route
                path="*"
                element={
                  <>
                    <Nav />
                    <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/" element={<Home />} />
                      <Route path="/About" element={<About />} />
                      <Route path="/Contact" element={<Contact />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </Router>
        </div>
  );
}

export default App;
