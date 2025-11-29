import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <img src="/LogoQuijoteHD.png" alt="Quijote Logo" className="nav-logo" />

        <div className="nav-buttons">
          <Link to="/reservar" className="nav-btn">Reservar</Link>
          <button className="nav-btn personal">Personal</button>
        </div>
      </div>
    </nav>
  )
}