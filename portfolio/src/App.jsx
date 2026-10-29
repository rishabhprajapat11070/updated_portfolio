import { memo } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Blog from './pages/blog';
import { Route,Routes } from 'react-router-dom';
import AdminPost from "./pages/AdminPost";


 
const App = () => {
  return (
    <>
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<AdminPost />} />
      </Routes>
      <Footer/>
     
    </div>
  </>
  );
};

export default memo(App);