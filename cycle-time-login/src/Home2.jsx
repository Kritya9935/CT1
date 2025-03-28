import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home2 = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/login');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '80px auto',
        padding: '30px',
        background: 'linear-gradient(135deg, #ffffff, #f0f4f8)',
        borderRadius: '15px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Poppins', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}
    >
      <button
        onClick={handleAdminLogin}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#e67e22', // Orange for Admin
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.2s ease'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#d35400') || (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#e67e22') || (e.target.style.transform = 'scale(1)')}
      >
        Admin Login
      </button>
      <button
        onClick={handleUserLogin}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#9b59b6', // Purple for User
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.2s ease'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#8e44ad') || (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#9b59b6') || (e.target.style.transform = 'scale(1)')}
      >
        User Login
      </button>
    </div>
  );
};

export default Home2;