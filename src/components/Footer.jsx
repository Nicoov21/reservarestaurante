import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo-section">
          <img src="/LogoQuijoteHD.png" alt="Quijote Logo" className="footer-logo" />
        </div>
        <div className="footer-social">
          <h3>Redes sociales</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/quijoterestaurant/?hl=es" target="_blank" rel="noopener noreferrer" className="icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/QuijoteRestaurantCL/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
        <div className="footer-contact">
          <h3>Información de contacto</h3>
          <p>Barros Arana #673, Concepción</p>
          <p>
            <a href="mailto:mrios@comerciallama.cl">mrios@comerciallama.cl</a>
          </p>
          <p>
            <a href="tel:412246000">41 224 6000</a>
          </p>
        </div>
      </div>
      <div className="footer-copyright">
        <p>©2025 Quijote. Todos los derechos reservados</p>
      </div>
    </footer>
  )
}