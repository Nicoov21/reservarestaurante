import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import LocationSection from '../components/Location';
import ReviewsSection from '../components/Reviews';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { supabase } from '../supabaseClient';
import '../components/TableMap.css';
import emailjs from '@emailjs/browser';

const tablePositions = {
  1: { top: '83%', left: '5%', shape: 'shape-circle', floor: 1 },
  2: { top: '63%', left: '5%', shape: 'shape-circle', floor: 1 },
  3: { top: '43%', left: '5%', shape: 'shape-circle', floor: 1 },
  4: { top: '25%', left: '15%', shape: 'shape-square', floor: 1 },
  5: { top: '55%', left: '23%', shape: 'shape-rect', floor: 1 },
  6: { top: '74%', left: '21%', shape: 'shape-square', floor: 1 },
  7: { top: '20%', left: '30%', shape: 'shape-circle', floor: 1 },
  8: { top: '39%', left: '25%', shape: 'shape-square', floor: 1 },
  9:  { top: '75%', left: '63%', shape: 'shape-square', floor: 1 },
  10: { top: '80%', left: '80%', shape: 'shape-rect', floor: 1 },
  11: { top: '57%', left: '63%', shape: 'shape-square', floor: 1 },
  12: { top: '58%', left: '80%', shape: 'shape-rect', floor: 1 },
  13: { top: '40%', left: '85%', shape: 'shape-circle', floor: 1 },
  14: { top: '40%', left: '67%', shape: 'shape-circle', floor: 1 },
  15: { top: '20%', left: '70%', shape: 'shape-circle', floor: 1 },
  16: { top: '23%', left: '85%', shape: 'shape-circle', floor: 1 },

  // Piso 2
  29: { top: '10%', left: '5%', shape: 'shape-rect', floor: 2 },
  24: { top: '10%', left: '25%', shape: 'shape-square', floor: 2 },
  30: { top: '35%', left: '8%', shape: 'shape-circle', floor: 2 },
  28: { top: '35%', left: '25%', shape: 'shape-rect', floor: 2 },
  21: { top: '60%', left: '5%', shape: 'shape-square', floor: 2 },
  20: { top: '82%', left: '5%', shape: 'shape-circle', floor: 2 },
  19: { top: '82%', left: '18%', shape: 'shape-circle', floor: 2 },
  25: { top: '20%', left: '68%', shape: 'shape-square', floor: 2 },
  27: { top: '8%', left: '85%', shape: 'shape-circle', floor: 2 },
  23: { top: '50%', left: '70%', shape: 'shape-square', floor: 2 },
  26: { top: '30%', left: '85%', shape: 'shape-square', floor: 2 },
  22: { top: '60%', left: '85%', shape: 'shape-square', floor: 2 },
  17: { top: '82%', left: '73%', shape: 'shape-circle', floor: 2 },
  18: { top: '82%', left: '87%', shape: 'shape-circle', floor: 2 },
};

const TableMap = ({ fecha, hora, onConfirmTable, onBack }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeFloor, setActiveFloor] = useState(1);

  useEffect(() => {
    const fetchTableStatus = async () => {
      setLoading(true);
      try {
        const { data: tablesData } = await supabase.from('tables').select('*').order('id_table');
        const targetTimestamp = `${fecha}T${hora}:00`;
        const { data: bookingsData } = await supabase
          .from('booking')
          .select('id_table, status_b')
          .eq('date_hour', targetTimestamp)
          .not('id_table', 'is', null);

        const mapWithStatus = (tablesData || []).map(table => {
          const booking = (bookingsData || []).find(b => b.id_table === table.id_table);
          let estado = 'libre';
          if (booking) {
            if (booking.status_b === 'pendiente') estado = 'pendiente';
            if (booking.status_b === 'confirmada') estado = 'ocupada';
          }
          return { ...table, estadoActual: estado };
        });

        setTables(mapWithStatus);
      } catch (error) {
        console.error("Error cargando mapa:", error);
      } finally {
        setLoading(false);
      }
    };

    if (fecha && hora) fetchTableStatus();
  }, [fecha, hora]);

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Cargando disponibilidad...</div>;

  return (
    <div className="map-layout">
      <div className="restaurant-floor">
        {activeFloor === 1 && (
          <>
            <div className="structure barra">Barra</div>
            <div className="structure cocina">Cocina</div>
            <div className="structure escalera">Escalera</div>
            <div className="structure entrada">Entrada</div>
            <div className="structure banos">Baños</div>
            <div className="planta p-izq"></div>
            <div className="planta p-der"></div>
          </>
        )}

        {activeFloor === 2 && (
           <>
             <div className="structure" style={{bottom: '0', left: '40%', width: '20%', height: '150px', background: 'repeating-linear-gradient(0deg, #d7ccc8, #d7ccc8 10px, #8d6e63 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, borderTop: '1px solid #8d6e63', writingMode: 'horizontal-tb'}}>
               <span style={{background:'rgba(255,255,255,0.7)', padding:'2px 5px', borderRadius:'4px'}}>Escalera</span>
             </div>
             <div style={{position: 'absolute', bottom: '0', left: '35%', width: '30%', height: '150px', backgroundColor: '#e0e0e0', borderTop: '1px solid #ccc'}}></div>
             <div style={{position: 'absolute', bottom: '0', right: '35%', width: '10%', height: '150px', backgroundColor: '#e0e0e0', borderTop: '1px solid #ccc'}}></div>
           </>
        )}

        {tables.map((mesa) => {
          const pos = tablePositions[mesa.id_table];
          if (!pos) return null;
          if (pos.floor !== activeFloor) return null;

          const isSelected = selectedTable?.id_table === mesa.id_table;
          let statusClass = `status-${mesa.estadoActual}`;
          if (isSelected) statusClass = 'status-selected';

          return (
            <button
              key={mesa.id_table}
              className={`table-btn ${pos.shape} ${statusClass}`}
              style={{ top: pos.top, left: pos.left }}
              disabled={mesa.estadoActual !== 'libre'}
              onClick={() => setSelectedTable(mesa)}
            >
              {mesa.number_table ? mesa.number_table.replace('Mesa ', '') : mesa.id_table}
            </button>
          );
        })}
      </div>

      <div className="map-sidebar">
        <div className="floor-tabs">
          <button className={`tab ${activeFloor === 1 ? 'active' : ''}`} onClick={() => { setActiveFloor(1); setSelectedTable(null); }}>Primer piso</button>
          <button className={`tab ${activeFloor === 2 ? 'active' : ''}`} onClick={() => { setActiveFloor(2); setSelectedTable(null); }}>Segundo piso</button>
        </div>
        <div className="legend">
          <div className="legend-item"><div className="dot" style={{background:'#a5d6a7'}}></div> Disponible</div>
          <div className="legend-item"><div className="dot" style={{background:'#ffcc80'}}></div> Pendiente</div>
          <div className="legend-item"><div className="dot" style={{background:'#ef9a9a'}}></div> Ocupada</div>
        </div>
        <div className="table-details">
          {selectedTable ? (
            <>
              <h3 style={{margin:0, color:'#3e2723'}}>{selectedTable.number_table}</h3>
              <p style={{margin:'5px 0', fontSize:'0.9rem'}}>Capacidad: {selectedTable.capacity} 👤</p>
            </>
          ) : (
            <p style={{color:'#999'}}>Selecciona una mesa</p>
          )}
          
          <img src="/FondoImagen.png" alt="Quijote" className="quijote-sidebar-img" />
          
          <button 
            className="btn-select-final"
            disabled={!selectedTable}
            onClick={() => onConfirmTable(selectedTable)}
          >
            Seleccionar
          </button>

          <button 
            onClick={onBack}
            style={{marginTop:'10px', background:'none', border:'none', textDecoration:'underline', cursor:'pointer'}}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

const ReservarFormulario = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [personas, setPersonas] = useState(1);
  const [sillaBebe, setSillaBebe] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comentario, setComentario] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!nombre || !email || !telefono || !fecha || !hora) {
      setToast({ show: true, message: "Faltan datos obligatorios", type: "error" });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }
    setStep(2);
  };

  const sendConfirmationEmail = (tableId) => {
    const templateParams = {
      to_name: nombre,
      to_email: email,
      date: fecha,
      time: hora,
      table: tableId,
      people: personas
    };

    emailjs.send(
      'service_axvoarn',
      'template_7lr3y8a',
      templateParams,
      'u8h_INl_ULHEvFfKL'
    )
    .then((response) => {
      console.log('Correo enviado con éxito!', response.status, response.text);
    }, (error)  => {
      console.error('Error al enviar correo:', error);
    });
  };

  const handleFinalSubmit = async (table) => {
    setLoading(true);
    try {
      let clientId = null;
      const { data: existingClient, error: searchError } = await supabase
        .from('clients')
        .select('id_client')
        .eq('email_client', email)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingClient) {
        clientId = existingClient.id_client;
      } else {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert([{ name_client: nombre, email_client: email, number_client: telefono, history_reserve: 0 }])
          .select().single();
        
        if (createError) throw createError;
        clientId = newClient.id_client;
      }

      const timestamp = `${fecha}T${hora}:00`; 
      const { error: bookingError } = await supabase.from('booking').insert([{
            date_hour: timestamp,
            number_people: personas,
            id_client: clientId,
            status_b: 'pendiente',
            commentary: comentario,
            baby_chair: sillaBebe,
            id_table: table.id_table
      }]);

      if (bookingError) throw bookingError;
      
      const newBooking = {
        id: Date.now(),
        date: fecha,
        time: hora,
        client: nombre,
        people: `${personas} personas`,
        table: table.number_table,
        status: 'Pendiente'
      };

      const existingBookings = JSON.parse(localStorage.getItem('reservations')) || [];
      localStorage.setItem('reservations', JSON.stringify([...existingBookings, newBooking]));

      sendConfirmationEmail(table.id_table);
      setLoading(false);
      setStep(3);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: "Error: " + error.message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <div className={`reserva-form-container ${step >= 2 ? 'wide-mode' : ''}`}>
      {step === 1 && (
        <>
          <h3>Reserva tu mesa en Quijote</h3>
          <div className="frame-container">
            <input type="date" value={fecha} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFecha(e.target.value)} required />
            <select value={hora} onChange={(e) => setHora(e.target.value)} required>
              <option value="">Seleccione la hora:</option>
              <option>13:00</option><option>14:00</option><option>15:00</option>
              <option>16:00</option><option>17:00</option><option>18:00</option>
              <option>19:00</option><option>20:00</option>
            </select>
          </div>
          <div className="people-selector">
            {[1,2,3,4,5,6,7,8].map(n => (
              <button key={n} type="button" className={`person-btn ${personas===n?"selected":""}`} onClick={()=>setPersonas(n)}>{n}</button>
            ))}
          </div>
          <div className="baby-chair">
            <input type="checkbox" checked={sillaBebe} onChange={() => setSillaBebe(!sillaBebe)} />
            <label>¿Desea silla para bebé?</label>
          </div>
          <p className="fill-data">¡Rellena con tus datos!</p>
          <input type="text" placeholder="Nombre completo" value={nombre} onChange={e=>setNombre(e.target.value)} required />
          <div className="email-phone">
            <input type="email" placeholder="Correo electrónico" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input type="tel" placeholder="+56 9..." value={telefono} onChange={e=>setTelefono(e.target.value)} required />
          </div>
          <textarea placeholder="Alergias, evento especial, etc..." rows="3" value={comentario} onChange={e=>setComentario(e.target.value)} />
          {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
          <button className="continue-button" type="button" onClick={handleContinue}>Siguiente</button>
        </>
      )}

      {step === 2 && (
        <>
           {loading ? <div style={{padding: 40, textAlign: 'center'}}>Procesando...</div> : 
             <TableMap fecha={fecha} hora={hora} onConfirmTable={handleFinalSubmit} onBack={() => setStep(1)} />
           }
        </>
      )}

      {step === 3 && (
        <div style={{textAlign: 'center', padding: '40px 20px'}}>
          <div style={{width: '80px', height: '80px', background: '#4caf50', borderRadius: '50%', color: 'white', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>✓</div>
          <h2 style={{color: '#3e2723', marginBottom: '20px'}}>¡Reserva Confirmada!</h2>
          <p style={{fontSize: '1.2rem', color: '#555', lineHeight: '1.6'}}>
            Te esperamos el <strong>{fecha}</strong> a las <strong>{hora}</strong> horas.
          </p>
          <p style={{fontSize: '1rem', color: '#666', marginTop: '10px'}}>
            Te hemos enviado un correo para respaldar la confirmación a:<br/>
            <strong style={{color: '#e67e22'}}>{email}</strong>
          </p>
          <button className="continue-button" style={{marginTop: '40px', width: '200px'}} 
            onClick={() => { 
              onClose(); 
              setStep(1); setNombre(""); setEmail(""); setFecha(""); setHora(""); setTelefono(""); setComentario(""); 
            }}>
            Entendido
          </button>
        </div>
      )}
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL HOME ---
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Navbar onReserveClick={() => setIsModalOpen(true)} />
      <div style={{ position: 'relative', height: '100vh', backgroundImage: 'url("/FondoQuijoteHDD.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center top', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white' }} className="hero-section">
        <button onClick={() => setIsModalOpen(true)} className="btn-reserva" style={{ position: 'absolute', bottom: '100px', background: 'linear-gradient(135deg, #a67c52, #8b5e3c)', color: 'white', padding: '20px 50px', fontSize: '1rem', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', border: 'none', borderRadius: '60px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', cursor: 'pointer', zIndex: 10 }}>
          Hacer una reserva
        </button>
      </div>
      <Carousel />
      <LocationSection />
      <ReviewsSection />
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ReservarFormulario onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}