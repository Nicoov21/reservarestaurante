import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Carousel from '../components/carousel'
import LocationSection from '../components/Location'
import ReviewsSection from '../components/Reviews'
import Footer from '../components/Footer'


export default function Home() {
  return (
    <> 
        <Navbar />
        <div style={styles.heroContainer} className='hero-section'>
        <Link to="/reservar" className='btn-reserva'>
            Hacer una reserva
        </Link>
        </div>
        <section className="info-section">
        <div className="info-card">
          <img src="/FondoImagen.png" alt="Dibujo Quijote" className="quijote-img" />
          
          {/* Texto */}
          <div className="info-text">
            <h2>Desde 2008: El Clásico Inconfundible del Centro</h2>
            <p>
              Inaugurado en 2008, Quijote es el amplio restaurante (700 m²) 
              que trajo variedad y sabor al centro de Concepción. 
              Encuentra lo que busques en un solo lugar y disfruta de nuestro 
              servicio que te hará sentir como en casa.
            </p>
            <p>
              <strong>Calidad, ambiente espacioso y un servicio cercano. 
              Reserva tu mesa y sé parte de nuestra historia.</strong>
            </p>
          </div>
        </div>
      </section>
      <Carousel/>
      <LocationSection />
      <ReviewsSection/>
      <Footer/>
    </>
  )
}

const styles = {
    heroContainer: {
      backgroundImage: 'url("/FondoQuijoteHDD.jpeg")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: '5vh'
    }
  }