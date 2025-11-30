export default function LocationSection() {
    return (
      <section className="location-section">
        <div className="gray-container">

          <div className="map-wrapper">
            <iframe 
              title="Mapa Quijote"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              src="https://maps.google.com/maps?q=Barros+Arana+673,+Concepcion&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
            ></iframe>
          </div>

          <div className="contact-card">

            <div className="contact-item">
              <div className="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3>Dirección</h3>
                <p>Barros Arana #673, Concepción</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h3>Horario de atención</h3>
                <p><strong>Lunes-Viernes:</strong><br/> 13:00 hrs - 20:00 hrs.</p>
                <p style={{marginTop: '5px'}}><strong>Sábado:</strong><br/> 13:00 hrs - 18:00 hrs.</p>
                <p style={{marginTop: '5px'}}><strong>Domingo:</strong><br/> Cerrado</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-box">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3>Información de contacto</h3>
                <p>Email: <span style={{color: '#e67e22'}}>reservasconce@quijoterestaurant.cl</span></p>
                <p>Teléfono: <span style={{color: '#e67e22'}}>41 224 6000</span></p>
              </div>
            </div>
  
          </div>
        </div>
      </section>
    )
  }