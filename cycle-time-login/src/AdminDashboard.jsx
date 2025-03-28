import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [generatedUserId, setGeneratedUserId] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.message === 'User created successfully') {
        setGeneratedUserId(data.userId);
        setGeneratedPassword(data.password);
        alert(`User created!\nUser ID: ${data.userId}\nPassword: ${data.password}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to create user');
    }
  };

  const handleDownloadRedirect = () => {
    console.log('Download button clicked ');
    navigate('/admin'); // Redirect to Admin page
  };

  return (
    <div style={{maxWidth:'600px',margin:'40px auto',padding:'25px',background:'linear-gradient(135deg, #ffffff, #f0f4f8)',borderRadius:'15px',boxShadow:'0 6px 12px rgba(0,0,0,0.15',fontFamily:"'poppins', sans-serif"}}>

      <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '30px',
          fontWeight: '600',
          marginBottom: '25px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>Admin Dashboard</h2>

      <h3 style={{
          color: '#34495e',
          fontSize: '22px',
          marginBottom: '20px',
          fontWeight: '500',
          borderBottom: '3px solid #3498db',
          paddingBottom: '8px',
          width: 'fit-content'
        }}>Create New User</h3>

      <form onSubmit={handleCreateUser} style={{display:'flex',flexDirection:'column',   
        gap:'20px'}}>
        <div>
          <input
            type="email"
            placeholder="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            style={{width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #bdc3c7',
              fontSize: '16px',
              color: '#2c3e50',
              backgroundColor: '#ecf0f1',
              outline: 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'}}
              onFocus={(e) => (e.target.style.borderColor = '#3498db') || (e.target.style.boxShadow = '0 0 8px rgba(52, 152, 219, 0.3)')}
            onBlur={(e) => (e.target.style.borderColor = '#bdc3c7') || (e.target.style.boxShadow = 'none')}
          />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button type="submit" style={{flex: 1,
              padding: '14px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',}}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#27ae60') || (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#2ecc71') || (e.target.style.transform = 'scale(1)')}>
                Generate User ID & Password
          </button>

          <button type="button" onClick={handleDownloadRedirect} style={{ 
              marginLeft: '10px',
              flex: 1,
              padding: '14px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease', }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#2980b9') || (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3498db') || (e.target.style.transform = 'scale(1)')}>
           Download Data
         </button>
       </div>
      </form>


      {generatedUserId && generatedPassword && (
        <div style={{marginTop: '25px',
          padding: '20px',
          backgroundColor: '#ecf0f1',
          borderRadius: '10px',
          border: '1px solid #bdc3c7',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'}}>

          <p style={{margin: '8px 0',
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: '500'}}>
              <strong style ={{color : '#e74c3c'}}>Generated User ID: </strong>{generatedUserId}</p>

          <p style={{margin: '8px 0',
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: '500'}}>
                <strong style={{color : '#e74c3c'}}>Generated Password:</strong>{generatedPassword}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;