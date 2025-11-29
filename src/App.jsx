import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Componente temporal para que el botón funcione
const Reservar = () => <h1 style={{color: 'black', textAlign: 'center'}}>Aquí irá el formulario de reservas</h1>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservar" element={<Reservar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App