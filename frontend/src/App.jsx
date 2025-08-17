import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/page/home/home.jsx';
// import About from './pages/About';
// import Products from './pages/Products';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
