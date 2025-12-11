import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // IMPORTANTE: Importar cliente

// --- Iconos SVG (Se mantienen igual) --- 
const UserIcon = ({ style }) => (
  <svg style={style} width="20" height="20" viewBox="0 0 24 24" fill="#9e9e9e" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const LockIcon = ({ style }) => (
  <svg style={style} width="20" height="20" viewBox="0 0 24 24" fill="#9e9e9e" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

export default function LoginPersonal() {
  const [email, setEmail] = useState(''); // Cambié 'username' por 'email'
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN REAL ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Preguntamos a Supabase si el usuario existe
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2. Si existe, Supabase guarda la sesión automática y nosotros redirigimos
      console.log("Login correcto:", data);
      navigate('/Admin'); // Asegúrate que la ruta sea '/Admin' (con mayúscula si así está en App.jsx)

    } catch (error) {
      console.error(error);
      setError('Credenciales incorrectas o usuario no registrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#F1ECE5',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
    }}>
      {/* --- Columna del Formulario --- */}
      <div style={{
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: 'white',
          padding: '50px 60px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: '420px',
          textAlign: 'center',
        }}>
          <img 
            src="/LogoQuijoteHD.png" 
            alt="Logo Quijote" 
            style={{ 
              width: '200px', 
              marginBottom: '10px', 
              filter: 'invert(1)' 
            }} 
          />
          <p style={{ margin: '0', color: '#B0A59A', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            RESTAURANT • CAFÉ • BAR
          </p>
          <p style={{ marginTop: '5px', color: '#C8BBAE', fontSize: '0.8rem' }}>
            CONCEPCIÓN • SANTIAGO
          </p>
          
          <form onSubmit={handleLogin} style={{ marginTop: '40px' }}>
            {error && <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginBottom: '15px', background: '#ffebee', padding: '10px', borderRadius: '5px' }}>{error}</div>}

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <UserIcon style={{ position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)' }}/>
              <input
                type="email" // Importante: type email para validación navegador
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 50px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: '#FEFDF8',
                  fontSize: '1rem',
                  color: '#333',
                }}
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '30px' }}>
               <LockIcon style={{ position: 'absolute', top: '50%', left: '18px', transform: 'translateY(-50%)' }}/>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 50px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: '#FEFDF8',
                  fontSize: '1rem',
                  color: '#333',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                borderRadius: '8px',
                background: '#6F5B4C',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.3s',
              }}
            >
              {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>

         <p style={{ marginTop: '30px', color: '#8D6E63', fontSize: '0.9rem' }}>
           ¿No puedes ingresar?{' '}
           <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#6F5B4C', fontWeight: 'bold', textDecoration:'none' }}>
             Recuperar contraseña
           </a>
         </p>
      </div>

      {/* --- Columna de la Imagen --- */}
      <div style={{
        width: '50%',
        minHeight: '100vh',
        backgroundImage: 'url(/quijote-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
    </div>
  );
}