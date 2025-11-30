import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.25C14.38,2.01,14.17,1.82,13.92,1.82 h-3.84c-0.25,0-0.46,0.19-0.48,0.43L9.21,4.65c-0.59,0.24-1.12,0.56-1.62,0.94L5.2,4.63C4.98,4.56,4.73,4.63,4.61,4.83L2.69,8.15 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.79,10.68,4.77,11,4.77,11.32c0,0.33,0.02,0.64,0.07,0.95l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.39,2.4 c0.02,0.24,0.23,0.43,0.48,0.43h3.84c0.25,0,0.46-0.19,0.48-0.43l0.39-2.4c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);
const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.primary} style={{ marginRight: '8px' }} xmlns="http://www.w3.org/2000/svg">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM5 8V6h14v2H5z"/>
    </svg>
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
  const [allReservations, setAllReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reservations')) || [];
    setAllReservations(stored);
  }, []);

  useEffect(() => {
    const filtered = allReservations.filter(r => r.date === selectedDate);
    setFilteredReservations(filtered);
  }, [selectedDate, allReservations]);

  const handleLogout = () => navigate('/personal');

  const handleAction = (id, newStatus) => {
    let updatedReservations;
    if (newStatus === 'cancelled') {
        updatedReservations = allReservations.filter(r => r.id !== id);
    } else {
        updatedReservations = allReservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    }
    setAllReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, color: COLORS.primary }}>
      <header style={{ background: COLORS.primary, color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">
          <img src="/LogoQuijoteHD.png" alt="Quijote Logo" style={{ height: '60px', cursor: 'pointer' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <GearIcon />
          <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Panel de administración</span>
        </div>
      </header>

      <main style={{ padding: '30px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold' }}>Panel de Administracion</h1>
                <p style={{ margin: '5px 0 0', color: COLORS.secondary, fontSize: '1rem' }}>Gestión de reserva y análisis de restaurante.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: '500', background: 'white', padding: '8px 12px', borderRadius: '8px' }}>
                <CalendarIcon />
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ border: 'none', background: 'none', fontSize: '1rem', color: COLORS.primary, fontWeight: '500'}}
                />
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: COLORS.secondary, cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
                Salir →
              </button>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'flex-start' }}>
          <div style={{ background: COLORS.surface, borderRadius: '12px', padding: '25px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: '600', textAlign: 'center' }}>Nº DE RESERVAS</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyReservations} margin={{ top: 20, right: 10, left: -10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.secondary }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: COLORS.secondary }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', borderColor: '#eee', fontSize: '12px' }} />
                  <Bar dataKey="value" name="Reservas" fill="#4A6C9B" barSize={15} radius={[5, 5, 0, 0]} label={{ position: 'top', fontSize: 10, fill: COLORS.secondary }}/>
              </BarChart>
            </ResponsiveContainer>
            <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '10px', color: COLORS.secondary}}>MESES</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Reservas</h2>
                <span style={{ fontWeight: '500' }}>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div style={{ background: COLORS.surface, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ background: '#F9F8F6' }}>
                          {['Hora', 'Cliente', 'Mesa', 'Estado', 'Acciones'].map(header => (
                              <th key={header} style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: COLORS.secondary, fontSize: '0.9rem', textTransform: 'uppercase', borderBottom: `1px solid ${COLORS.accent}` }}>
                                  {header}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {filteredReservations.length > 0 ? filteredReservations.map(r => (
                          <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.accent}` }}>
                              <td style={{ padding: '15px 20px', fontWeight: '500' }}>{r.time}</td>
                              <td style={{ padding: '15px 20px' }}>
                                  <div style={{ fontWeight: 'bold' }}>{r.client}</div>
                                  <div style={{ fontSize: '0.9rem', color: COLORS.secondary }}>{r.people}</div>
                              </td>
                              <td style={{ padding: '15px 20px' }}>{r.table}</td>
                              <td style={{ padding: '15px 20px' }}><span style={{ color: r.status === 'Confirmado' ? COLORS.confirm : COLORS.pending, fontWeight: 'bold' }}>{r.status}</span></td>
                              <td style={{ padding: '15px 20px' }}>
                                  <div style={{ display: 'flex', gap: '10px' }}>
                                      {r.status === 'Pendiente' ? (
                                          <>
                                              <ActionButton type="confirm" onClick={() => handleAction(r.id, 'Confirmado')} />
                                              <ActionButton type="cancel" onClick={() => handleAction(r.id, 'cancelled')} />
                                          </>
                                      ) : (<ActionButton type="cancel" onClick={() => handleAction(r.id, 'cancelled')} />)}
                                  </div>
                              </td>
                          </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: COLORS.secondary }}>
                            No hay reservas para la fecha seleccionada.
                          </td>
                        </tr>
                      )}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}