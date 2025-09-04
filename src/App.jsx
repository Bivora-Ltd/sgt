import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Contestants from './pages/Contestants.jsx';
import Register from './pages/Register.jsx';
import Donate from './pages/Donate.jsx';
import Admin from './pages/Admin.jsx';
import Search from './pages/Search.jsx';
import ContestantProfile from './components/contestants/ContestantProfile.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import NotFound from './components/NotFound.jsx';

function App() {
  return (
    <Router>
      < ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contestants" element={<Contestants />} />
            <Route path="/contestants/:id" element={<ContestantProfile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;