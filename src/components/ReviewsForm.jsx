import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ReviewForm({ onReviewAdded }) {
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5 })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('reviews')
      .insert([
        { name: formData.name, text: formData.text, rating: formData.rating }
      ])

    setLoading(false)

    if (error) {
      alert('Error al enviar reseña: ' + error.message)
    } else {
      setFormData({ name: '', text: '', rating: 5 })
      alert('¡Gracias por tu opinión!')
      if (onReviewAdded) onReviewAdded()
    }
  }

  return (
    <div style={{ marginTop: '10px', padding: '20px', backgroundColor: 'white', borderRadius: '15px', maxWidth: '550px', width: '100%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>Dejar una Reseña</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Tu nombre" 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label>Calificación:</label>
          <select 
            value={formData.rating} 
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
            style={{ padding: '5px' }}
          >
            <option value="5">★★★★★ Excelente</option>
            <option value="4">★★★★☆ Muy bueno</option>
            <option value="3">★★★☆☆ Regular</option>
            <option value="2">★★☆☆☆ Malo</option>
            <option value="1">★☆☆☆☆ Pésimo</option>
          </select>
        </div>

        <textarea 
          placeholder="Cuéntanos tu experiencia..." 
          required 
          rows="3"
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none' }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#6d4c41', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Enviando...' : 'Publicar Comentario'}
        </button>
      </form>
    </div>
  )
}