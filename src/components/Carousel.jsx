import { useState, useEffect, use } from "react";

export default function Carousel(){
    const images = [
        "/carousel/Carrusel4.png",
        "/carousel/Carrusel1.jpg",
        "/carousel/Carrusel2.jpg",
        "/carousel/Carrusel3.jpg"
    ]
    const [selectedIndex , setSelectedIndex] = useState(0)
    const [direction, setDirection] = useState('right')

    const nextSlide = () => {
        setDirection('right')
        setSelectedIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        )
    }
    const prevSlide = () => {
        setDirection('left')
        setSelectedIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        )
    }

    useEffect(() => {
        const intervalo = setInterval(() => {
            nextSlide()
        }, 4000)
        return () => clearInterval(intervalo)
    }, [])

    const prevIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
    const nextIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1

    return (
        <div className="carousel-section">
          <div className="carousel-container">

            <div className="slide side-slide" onClick={prevSlide}>
              <img key={prevIndex} src={images[prevIndex]} alt="Previous" className="anim-fade"/>
              <div className="overlay">
                <span className="arrow">«</span>
              </div>
            </div>

            <div className="slide main-slide">
              <img 
                key={selectedIndex}
                src={images[selectedIndex]} 
                alt="Selected" 
                className={direction === 'left' ? 'anim-fade-left' : 'anim-fade-right'}
              />
            </div>

            <div className="slide side-slide" onClick={nextSlide}>
              <img key={nextIndex} src={images[nextIndex]} alt="Next" className="anim-fade"/>
              <div className="overlay">
                 <span className="arrow">»</span>
              </div>
            </div>
    
          </div>
        </div>
      )
}