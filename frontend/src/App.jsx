<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/page/home/home.jsx';
// import About from './pages/About';
// import Products from './pages/Products';
=======
import React from 'react'
import Sidebar from './components/sidebar/Sidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
>>>>>>> ankita

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
=======
      <div className="flex">
        {/* Sidebar fixed on the left */}
        <div className="w-64 min-h-screen bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main content on the right */}
        <div className="flex-1 ">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
>>>>>>> ankita
