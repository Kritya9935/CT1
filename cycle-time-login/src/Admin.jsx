import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:3001/export-home-csv', {
        params: { startDate, endDate },
        responseType: 'blob', // Important for handling binary data
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'homes.csv'); // Filename for the downloaded file
      // link.setAttribute('download', `homes_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      alert('CSV downloaded successfully!');
    } catch (err) {
      console.log("Error downloading CSV" , err);
      alert('Failed to download CSV. Please check the dates and try again.');
    }
  };

  return (
    <div style={{ padding: '10px', maxWidth: '500px', margin: 'auto', textAlign: 'center' , borderRadius: "10px" , boxShadow:"0 4px 8px rgba(0, 0, 0, 0.5)"}}>
      <h2>Download CSV Data</h2>
      <hr />
      <div style={{ margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>
      <button
        onClick={handleDownloadCSV}
        style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Download CSV
      </button>
    </div>

  );
};

export default Admin;