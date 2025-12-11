import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser';

export default function GestionarReserva({ onClose }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fecha: '',
    hora: '',
    personas: 2
  });

  const enviarCorreo = (templateId, datosExtras = {}) => {
    const fechaObj = new Date(datosExtras.timestamp || booking?.date_hour);
    const fechaStr = fechaObj.toLocaleDateString('es-CL', {timeZone: 'UTC'});
    const horaStr = fechaObj.toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', timeZone:'UTC'});

    const params = {
        to_name: booking?.clients?.name_client,
        to_email: booking?.clients?.email_client,
        date: fechaStr,
        time: horaStr,
        code: booking?.booking_code,
        ...datosExtras
    };

    emailjs.send('service_axvoarn', templateId, params, 'u8h_INl_ULHEvFfKL')
      .then(() => console.log("Correo enviado"))
      .catch(err => console.error("Error correo", err));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBooking(null);
    setSuccessMsg('');

    try {
      const { data, error } = await supabase
        .from('booking')
        .select(`
            *, 
            clients!inner(email_client, name_client),
            tables ( id_table, capacity, number_table )
        `)
        .eq('booking_code', code.toUpperCase().trim())
        .eq('clients.email_client', email.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('No encontramos una reserva con esos datos.');
      } else {
        setBooking(data);
        const isoString = data.date_hour;
        const [fechaRaw, timePart] = isoString.split('T');
        const horaRaw = timePart.substring(0, 5); 

        setEditForm({
            fecha: fechaRaw,
            hora: horaRaw,
            personas: data.number_people
        });
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al buscar.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu reserva?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('booking')
        .update({ status_b: 'cancelada' })
        .eq('id_booking', booking.id_booking);

      if (error) throw error;

      setSuccessMsg('Tu reserva ha sido cancelada.');
      setBooking({ ...booking, status_b: 'cancelada' });
    } catch (err) {
      setError('Error al cancelar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError('');
    if (booking.tables) {
        const capacidadMesa = booking.tables.capacity;
        if (Number(editForm.personas) > capacidadMesa) {
            setError(`Tu mesa (${booking.tables.number_table}) solo tiene capacidad para ${capacidadMesa}. No puedes aumentar a ${editForm.personas}. Si deseas una mesa con más capacidad, debes cancelar esta reserva y reservar una nueva.`);
            return;
        }
    }

    setLoading(true);
    try {
      const timestamp = `${editForm.fecha}T${editForm.hora}:00Z`;

      const { error } = await supabase
        .from('booking')
        .update({
            date_hour: timestamp,
            number_people: editForm.personas,
            status_b: 'pendiente'
        })
        .eq('id_booking', booking.id_booking);

      if (error) throw error;

      setSuccessMsg('Reserva modificada. Tu solicitud volverá a ser revisada por el personal.');
      setIsEditing(false);
      
      setBooking({ 
          ...booking, 
          date_hour: timestamp, 
          number_people: editForm.personas, 
          status_b: 'pendiente' 
      });

    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', width: '500px', maxWidth: '100%' }}>
      <h3 style={{ color: '#3e2723', textAlign: 'center', marginBottom: '20px' }}>
        Gestionar tu Reserva
      </h3>

      {!booking && (
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Código de Reserva (Ej: A1B2C3)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', textTransform: 'uppercase' }}
          />
          
          {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: '#3e2723',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Buscando...' : 'Buscar Reserva'}
          </button>
        </form>
      )}

      {booking && (
        <div style={{ background: '#f5f0e6', padding: '20px', borderRadius: '10px', marginTop: '10px' }}>
          
          {isEditing ? (
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <h4 style={{color:'#3e2723', margin:0}}>Modificar Datos</h4>
                
                {error && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom:'10px' }}>{error}</div>}

                <label style={{fontSize:'0.9rem'}}>Fecha:</label>
                <input 
                    type="date" 
                    value={editForm.fecha} 
                    onChange={e => setEditForm({...editForm, fecha: e.target.value})}
                    style={{padding:'8px'}}
                />

                <label style={{fontSize:'0.9rem'}}>Hora:</label>
                <select 
                    value={editForm.hora} 
                    onChange={e => setEditForm({...editForm, hora: e.target.value})}
                    style={{padding:'8px'}}
                >
                    <option>13:00</option><option>14:00</option><option>15:00</option>
                    <option>16:00</option><option>17:00</option><option>18:00</option>
                    <option>19:00</option><option>20:00</option>
                </select>

                <label style={{fontSize:'0.9rem'}}>Personas:</label>
                <div style={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
                    {[1,2,3,4,5,6,7,8].map(n => (
                        <button 
                            key={n} 
                            onClick={() => setEditForm({...editForm, personas: n})}
                            style={{
                                padding:'5px 10px', 
                                border:'1px solid #3e2723', 
                                background: editForm.personas === n ? '#3e2723' : 'white',
                                color: editForm.personas === n ? 'white' : '#3e2723',
                                cursor:'pointer'
                            }}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                    <button onClick={handleUpdate} style={{flex:1, padding:'10px', background:'#2e7d32', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Guardar Cambios</button>
                    <button onClick={() => setIsEditing(false)} style={{flex:1, padding:'10px', background:'#9e9e9e', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Cancelar</button>
                </div>
            </div>
          ) : (
            <>
                <h4 style={{ margin: '0 0 10px', color: '#5d4037' }}>Detalles de la Reserva</h4>
                
                <p><strong>Fecha:</strong> {new Date(booking.date_hour).toLocaleDateString('es-CL', {timeZone: 'UTC'})}</p>
                <p><strong>Hora:</strong> {new Date(booking.date_hour).toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit', timeZone:'UTC'})}</p>
                <p><strong>Personas:</strong> {booking.number_people}</p>
                <p><strong>Mesa:</strong> {booking.tables?.number_table || 'Por asignar'}</p>
                <p><strong>Estado:</strong> 
                    <span style={{ 
                    marginLeft: '5px', fontWeight: 'bold', 
                    color: booking.status_b === 'confirmada' ? 'green' : booking.status_b === 'cancelada' ? 'red' : 'orange' 
                    }}>
                    {booking.status_b.toUpperCase()}
                    </span>
                </p>

                {successMsg && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '5px', textAlign: 'center', fontSize:'0.9rem' }}>
                    {successMsg}
                    </div>
                )}

                {booking.status_b !== 'cancelada' && !successMsg && (
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ flex: 1, padding: '10px', background: '#f57c00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' }}
                    >
                        Modificar
                    </button>
                    <button
                        onClick={handleCancel}
                        style={{ flex: 1, padding: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' }}
                    >
                        Cancelar
                    </button>
                    </div>
                )}
            </>
          )}
          
          <button onClick={onClose} style={{ marginTop: '15px', width: '100%', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}