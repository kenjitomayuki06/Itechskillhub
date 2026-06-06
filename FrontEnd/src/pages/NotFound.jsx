import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9ff 100%)',
      padding: '40px 24px',
      fontFamily: "'Sora', sans-serif",
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '96px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #5B4A9E, #7B6BBD)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '16px',
      }}>
        404
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1f35', marginBottom: '12px' }}>
        Page Not Found
      </h1>

      <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.7' }}>
        The page you're looking for doesn't exist or may have been moved.
        Check the URL or head back to your dashboard.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: '2px solid #5B4A9E',
            background: 'transparent',
            color: '#5B4A9E',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #5B4A9E, #7B6BBD)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
