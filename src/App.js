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
      <p>Accessing only public profiles. 100% secure.</p> {/* Added message */}
      <p>If you find this app useful, please give it a star on GitHub:</p> {/* Added message */}
      <a href="https://github.com/Its-me-nishmal/wa-web-react" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/github/stars/Its-me-nishmal/wa-web-react.svg?style=social" alt="GitHub stars" />
      </a> {/* GitHub button */}
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="text" value={inputNumbers} onChange={handleInputChange} placeholder="Enter WhatsApp Numbers with country code" />
          <button type="submit">Fetch Data</button>
        </div>
      </form>
      <button onClick={handleDownloadAll}>Download All</button>
      <div className="whatsapp-data">
        {whatsappData.map((contact, index) => (
          <div key={index} className="contact">
            <img src={contact.profilePictureUrl || 'https://easimages.basnop.com/default-image_600.png'} alt="Profile" />
            <p>Number: {contact.number || 'Not a Valid Number'}</p>
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
