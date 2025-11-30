import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Admin from './pages/Admin'
import LoginPersonal from './pages/LoginPersonal'

function Layout() {
  const location = useLocation()

  const hideNavbar = location.pathname === '/admin'

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<LoginPersonal />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
