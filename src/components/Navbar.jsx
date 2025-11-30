import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onReserveClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <img src="/LogoQuijoteHD.png" alt="Quijote Logo" className="nav-logo" />

        <div className="nav-buttons">
          <button 
            onClick={onReserveClick}
            className="nav-btn"
          >
            Reservar
          </button>

          <Link to="/personal" className="nav-btn personal">
            Personal
          </Link>
        </div>
      </div>
    </nav>
  );
}