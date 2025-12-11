import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser';

const COLORS = {
  background: '#F1ECE5', surface: '#FFFFFF', primary: '#2D2A26', 
  secondary: '#6B5E51', accent: '#C8BBAE', confirm: '#28A745',
  pending: '#E59400', danger: '#DC3545'
};

const monthlyReservations = [
  { month: 'Ene', value: 54 }, { month: 'Feb', value: 89 }, { month: 'Mar', value: 66 },
  { month: 'Abr', value: 52 }, { month: 'May', value: 39 }, { month: 'Jun', value: 74 },
  { month: 'Jul', value: 45 }, { month: 'Ago', value: 35 }, { month: 'Sep', value: 40 },
  { month: 'Oct', value: 34 }, { month: 'Nov', value: 28 }, { month: 'Dec', value: 23 },
];

const GearIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.25C14.38,2.01,14.17,1.82,13.92,1.82 h-3.84c-0.25,0-0.46,0.19-0.48,0.43L9.21,4.65c-0.59,0.24-1.12,0.56-1.62,0.94L5.2,4.63C4.98,4.56,4.73,4.63,4.61,4.83L2.69,8.15 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.79,10.68,4.77,11,4.77,11.32c0,0.33,0.02,0.64,0.07,0.95l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.39,2.4 c0.02,0.24,0.23,0.43,0.48,0.43h3.84c0.25,0,0.46-0.19,0.48-0.43l0.39-2.4c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.primary} style={{ marginRight: '8px' }}><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"/></svg>
);

const ActionButton = ({ type, onClick }) => {
    const isConfirm = type === 'confirm';
    const bgColor = isConfirm ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)';
    const iconColor = isConfirm ? COLORS.confirm : COLORS.danger;
    return (
        <button onClick={onClick} style={{ background: bgColor, border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: iconColor, fontSize: '18px', fontWeight: 'bold' }}>
            {isConfirm ? '✓' : '✕'}
        </button>
    );
};

export default function Admin() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState('reservas');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/personal');
      else setLoading(false);
    };
    checkSession();
  }, [navigate]);

  const cargarDatos = async () => {
    if (view === 'reservas') {
        const start = `${selectedDate}T00:00:00`;
        const end = `${selectedDate}T23:59:59`;
        const { data } = await supabase.from('booking')
            .select(`*, clients(name_client, email_client, number_client)`)
            .gte('date_hour', start).lte('date_hour', end)
            .order('date_hour', { ascending: true });
        setReservas(data || []);
    } else {
        const { data } = await supabase.from('tables').select('*').order('id_table', { ascending: true });
        setTables(data || []);
    }
  };

  useEffect(() => {
    if (!loading) cargarDatos();
    
    const channel = supabase.channel('admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booking' }, cargarDatos)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, cargarDatos)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedDate, loading, view]);

  const enviarCorreo = (reserva, tipo) => {
    const fechaObj = new Date(reserva.date_hour);
    const fechaStr = fechaObj.toLocaleDateString('es-CL', {timeZone: 'UTC'}); 
    const horaStr = fechaObj.toLocaleTimeString('es-CL', {hour: '2-digit', minute:'2-digit', timeZone:'UTC'});

    const params = {
      to_name: reserva.clients?.name_client,
      to_email: reserva.clients?.email_client,
      date: fechaStr,
      time: horaStr,
      table: reserva.id_table,
      people: reserva.number_people,
      code: reserva.booking_code
    };

    const templateID = tipo === 'confirmada' ? 'template_7lr3y8a' : 'template_zpz12a6';

    emailjs.send('service_axvoarn', templateID, params, 'u8h_INl_ULHEvFfKL')
      .then(() => console.log(`Correo ${tipo} enviado`))
      .catch((err) => console.error("Error envío correo:", err));
  };

  const handleAction = async (id, nuevoEstado) => {
    const reserva = reservas.find(r => r.id_booking === id);
    if (!reserva || !window.confirm(`¿${nuevoEstado === 'confirmada' ? 'Aprobar' : 'Rechazar'} reserva?`)) return;

    if (nuevoEstado === 'confirmada') {
        const conflictos = reservas.filter(r => r.id_booking !== id && r.status_b === 'pendiente' && r.id_table === reserva.id_table && r.date_hour === reserva.date_hour);
        for (const c of conflictos) {
            await supabase.from('booking').update({ status_b: 'cancelada' }).eq('id_booking', c.id_booking);
            enviarCorreo(c, 'cancelada');
        }
        if(conflictos.length) alert(`Se cancelaron ${conflictos.length} reservas en conflicto.`);
    }

    await supabase.from('booking').update({ status_b: nuevoEstado }).eq('id_booking', id);
    enviarCorreo(reserva, nuevoEstado);
    cargarDatos();
  };

  const handleTableUpdate = async (id, campo, valor) => {
    await supabase.from('tables').update({ [campo]: valor }).eq('id_table', id);
    cargarDatos();
  };

  const handleAddTable = async () => {
    const num = prompt("Nombre de la nueva mesa (ej: Mesa 31):");
    const cap = prompt("Capacidad (número):");
    if(num && cap) {
        await supabase.from('tables').insert([{ number_table: num, capacity: parseInt(cap), ubication: 'Piso 1', status: true }]);
        cargarDatos();
        alert("Mesa creada. Nota: No aparecerá en el mapa visual hasta agregar sus coordenadas en el código.");
    }
  };

  const handleDeleteTable = async (id) => {
      if(window.confirm("¿Borrar esta mesa? Esto no se puede deshacer.")) {
          await supabase.from('tables').delete().eq('id_table', id);
          cargarDatos();
      }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  if (loading) return <div style={{padding:50, textAlign:'center'}}>Cargando...</div>;

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, color: COLORS.primary }}>
      <header style={{ background: COLORS.primary, color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">
          <img src="/LogoQuijoteHD.png" alt="Logo" style={{ height: '60px', cursor: 'pointer', filter:'brightness(0) invert(1)' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '20px', display: 'flex'}}>
             <button onClick={() => setView('reservas')} style={{padding: '8px 20px', borderRadius: '15px', border: 'none', background: view==='reservas' ? COLORS.accent : 'transparent', color: 'white', cursor:'pointer', fontWeight:'bold'}}>Reservas</button>
             <button onClick={() => setView('mesas')} style={{padding: '8px 20px', borderRadius: '15px', border: 'none', background: view==='mesas' ? COLORS.accent : 'transparent', color: 'white', cursor:'pointer', fontWeight:'bold'}}>Mesas</button>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Admin</span>
        </div>
      </header>

      <main style={{ padding: '30px 40px' }}>
        
        {view === 'reservas' && (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div><h1 style={{ margin: 0, fontSize: '2rem'}}>Gestión de Reservas</h1></div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px' }}>
                            <CalendarIcon /><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '1rem'}} />
                        </div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: COLORS.secondary, cursor: 'pointer', fontWeight: 'bold' }}>Salir →</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ background: COLORS.surface, borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', textAlign: 'center' }}>RESUMEN</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyReservations}><XAxis dataKey="month" /><Tooltip /><Bar dataKey="value" fill="#4A6C9B" /></BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ background: COLORS.surface, borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ background: '#F9F8F6' }}>{['Hora', 'Cliente', 'Mesa', 'Estado', 'Acciones'].map(h => <th key={h} style={{padding:'15px'}}>{h}</th>)}</tr></thead>
                            <tbody>
                                {reservas.map(r => (
                                    <tr key={r.id_booking} style={{ borderBottom: `1px solid ${COLORS.accent}` }}>
                                        <td style={{ padding: '15px' }}>{new Date(r.date_hour).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone:'UTC'})}</td>
                                        <td style={{ padding: '15px' }}><strong>{r.clients?.name_client}</strong><br/><small>{r.number_people} pax</small></td>
                                        <td style={{ padding: '15px' }}>Mesa {r.id_table}</td>
                                        <td style={{ padding: '15px', color: r.status_b==='confirmada'?COLORS.confirm:COLORS.pending }}>{r.status_b.toUpperCase()}</td>
                                        <td style={{ padding: '15px' }}>
                                            {r.status_b === 'pendiente' && (
                                                <><button onClick={()=>handleAction(r.id_booking, 'confirmada')} style={{marginRight:10}}>✅</button><button onClick={()=>handleAction(r.id_booking, 'cancelada')}>❌</button></>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}

        {view === 'mesas' && (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem'}}>Inventario de Mesas</h1>
                    <button onClick={handleAddTable} style={{background: COLORS.confirm, color:'white', padding:'10px 20px', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>+ Nueva Mesa</button>
                </div>

                <div style={{ background: COLORS.surface, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F9F8F6' }}>
                                <th style={{padding:'15px', textAlign:'left'}}>ID</th>
                                <th style={{padding:'15px', textAlign:'left'}}>Nombre</th>
                                <th style={{padding:'15px', textAlign:'left'}}>Capacidad (Personas)</th>
                                <th style={{padding:'15px', textAlign:'left'}}>Ubicación</th>
                                <th style={{padding:'15px', textAlign:'left'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map(t => (
                                <tr key={t.id_table} style={{ borderBottom: `1px solid ${COLORS.accent}` }}>
                                    <td style={{ padding: '15px' }}>{t.id_table}</td>
                                    <td style={{ padding: '15px' }}>
                                        <input 
                                            type="text" 
                                            defaultValue={t.number_table} 
                                            onBlur={(e) => handleTableUpdate(t.id_table, 'number_table', e.target.value)}
                                            style={{padding:5, borderRadius:5, border:'1px solid #ccc'}}
                                        />
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <input 
                                            type="number" 
                                            defaultValue={t.capacity} 
                                            onBlur={(e) => handleTableUpdate(t.id_table, 'capacity', e.target.value)}
                                            style={{padding:5, borderRadius:5, border:'1px solid #ccc', width: 60}}
                                        />
                                    </td>
                                    <td style={{ padding: '15px' }}>{t.ubication}</td>
                                    <td style={{ padding: '15px' }}>
                                        <button onClick={() => handleDeleteTable(t.id_table)} style={{color: 'red', border:'none', background:'none', cursor:'pointer', fontWeight:'bold'}}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

      </main>
    </div>
  );
}