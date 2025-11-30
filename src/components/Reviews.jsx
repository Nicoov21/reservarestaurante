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
    else setReviews(data || [])
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#d4a574' : '#ccc', fontSize: '1.4rem' }}>
        {i < rating ? '★' : '☆'}
      </span>
    ))
  }

  return (
    <section style={{
      backgroundColor: '#f5f0e6',
      padding: '100px 20px',
      textAlign: 'center'
    }}>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          background: 'linear-gradient(135deg, #a67c52, #8b5e3c)',
          color: 'white',
          padding: '20px 80px',
          fontSize: '1.6rem',
          fontWeight: '600',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '60px',
          boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          transition: 'all 0.4s ease',
          marginBottom: '80px'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-8px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        {showForm ? 'Ocultar Formulario' : 'Escribir una Reseña'}
      </button>

      {showForm && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto 80px',
          padding: '30px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <ReviewForm onReviewAdded={() => {
            fetchReviews()
            setShowForm(false)
          }} />
        </div>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        padding: '0 20px'
      }}>
        {reviews.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', color: '#666', fontStyle: 'italic', fontSize: '1.2rem' }}>
            Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{
                  width: '55px',
                  height: '55px',
                  backgroundColor: '#f0e6d6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6f47" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: '0', fontSize: '1.3rem', color: '#333' }}>
                    {review.name}
                  </h4>
                  <div style={{ marginTop: '5px' }}>
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p style={{ color: '#555', lineHeight: '1.7', fontStyle: 'italic', margin: '15px 0 0' }}>
                "{review.text}"
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}