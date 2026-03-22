import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const backgroundStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '3rem',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#fff',
    maxWidth: '600px',
    width: '90%',
  };

  const titleStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9,
  };

  const buttonStyle = {
    padding: '12px 32px',
    fontSize: '1.2rem',
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>FitGym AI</h1>
        <p style={subtitleStyle}>Your personal AI fitness assistant</p>
        <Link to="/booking">
          <button
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#e63946')}
          >
            Book Free Trial
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;