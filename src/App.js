// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [whatsappData, setWhatsappData] = useState([]);
  const [inputNumbers, setInputNumbers] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}?nums=${inputNumbers}`);
      const data = await response.json();
      setWhatsappData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputNumbers(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleDownload = (profilePictureUrl, status) => {
    fetch(profilePictureUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const filename = `status_${status}_${timestamp}.jpg`;
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        alert('Failed to download image. Please try again.');
      });
  };

  const handleDownloadAll = () => {
    whatsappData.forEach(contact => {
      handleDownload(contact.profilePictureUrl, contact.status.status);
    });
  };

  return (
    <div className="App">
      <h1>WhatsApp Profile Pictures & Statuses</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" value={inputNumbers} onChange={handleInputChange} placeholder="Enter WhatsApp Numbers" />
          <button type="submit">Fetch Data</button>
        </div>
      </form>
      <button onClick={handleDownloadAll}>Download All</button>
      <div className="whatsapp-data">
        {whatsappData.map((contact, index) => (
          <div key={index} className="contact">
            <img src={contact.profilePictureUrl} alt="Profile" />
            <p>Status: {contact.status.status || 'No status'}</p>
            <p>Last Updated: {new Date(contact.status.setAt).toLocaleString()}</p>
            <button onClick={() => handleDownload(contact.profilePictureUrl, contact.status.status)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}


export default App;
