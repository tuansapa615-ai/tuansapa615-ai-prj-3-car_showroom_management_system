import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import config from '../config';
import '../css/index.css';

function Headers() {
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/Header`);
        setHeaders(response.data); // Assuming this returns an array of headers
      } catch (error) {
        console.error('Error fetching headers data:', error);
      }
    };

    fetchHeaders();
  }, []);

  return (
    <Carousel data-bs-theme="dark">
      {headers.length > 0 ? (
        headers.map((header) => (
          <Carousel.Item key={header.id} className='slide-header'>
            <img
              className="d-block w-100"
              src={`${config.Url}/${header.imgBanner}`} // Dynamically load the image from the API
              alt={header.tile} // Use header tile for alt text
            />
            <Carousel.Caption
              style={{
                color: '#ffffff', // Set text color
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // Optional shadow for better readability
              }}
            >
              <h5>{header.tile}</h5> {/* Use header's title */}
              <p>{header.status}</p> {/* Display header status or another field */}
            </Carousel.Caption>
          </Carousel.Item>
        ))
      ) : (
        <p>Loading headers...</p>
      )}
    </Carousel>
  );
}

export default Headers;
