import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ReviewForm from './ReviewsForm'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [showForm, setShowForm] = useState(false)

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error cargando reseñas:', error)
    else setReviews(data)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star">
        {i < rating ? '★' : '☆'}
      </span>
    ))
  }

  return (
    <section className="reviews-section" style={{ flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-reserva" 
          style={{ padding: '10px 20px', fontSize: '1rem', marginBottom: '0' }}
        >
          {showForm ? 'Cerrar Formulario' : 'Escribir una Reseña'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ReviewForm onReviewAdded={() => {
            fetchReviews()
            setShowForm(false)
          }} />
        </div>
      )}

      <div className="reviews-container">
        
        {reviews.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Cargando opiniones...</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="user-icon">
                  {/* Icono de usuario genérico */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="review-info">
                  <h4>{review.name}</h4>
                  <div className="stars">{renderStars(review.rating)}</div>
                </div>
              </div>
              <p className="review-text">"{review.text}"</p>
            </div>
          ))
        )}

      </div>
    </section>
  )
}