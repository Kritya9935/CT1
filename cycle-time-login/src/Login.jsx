import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const data = await response.json();
      if (data.message === 'success' && !data.isAdmin) {
        navigate('/home'); // Redirect to form page
      } else if (data.message === 'success') {
        alert('Admins cannot log in here');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '60px auto',
        padding: '25px',
        background: 'linear-gradient(135deg, #ffffff, #f0f4f8)',
        borderRadius: '15px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '25px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        User Login
      </h2>
      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #bdc3c7',
              fontSize: '16px',
              color: '#2c3e50',
              backgroundColor: '#ecf0f1',
              outline: 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#3498db') || (e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)')}
            onBlur={(e) => (e.target.style.borderColor = '#bdc3c7') || (e.target.style.boxShadow = 'none')}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #bdc3c7',
              fontSize: '16px',
              color: '#2c3e50',
              backgroundColor: '#ecf0f1',
              outline: 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#3498db') || (e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)')}
            onBlur={(e) => (e.target.style.borderColor = '#bdc3c7') || (e.target.style.boxShadow = 'none')}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '14px',
            backgroundColor: '#9b59b6', // Purple for user login
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;