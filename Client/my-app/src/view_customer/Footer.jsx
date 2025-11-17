import React, { useEffect, useState } from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import config from '../config';

export default function Footer() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/brands`)
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the brands data!", error);
      });
  }, []);
  const [view, setView] = useState(null);

  useEffect(() => {
    const fetchView = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/View`);
        setView(response.data);
      } catch (error) {
        console.error('Error fetching View data:', error);
      }
    };

    fetchView();
  }, []);
  if (!view) {
    return <div>Loading...</div>;
  }

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted mt-5'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href={view.urlFace} className='me-4 text-reset'>
            <i className="bi bi-facebook"></i>
          </a>
          <a href={view.urltwitter} className='me-4 text-reset'>
            <i className="bi bi-twitter"></i>
          </a>
          <a href={view.urlinstagram} className='me-4 text-reset'>
            <i className="bi bi-instagram"></i>
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <i className="bi bi-car-front"> </i> Showroom Car
              </h6>
              <p className='fw-bold'>
              {view.footerSlogan}
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <p key={index}>
                    {brand.brandName}
                  </p>
                ))
              ) : (
                <p>Loading brands...</p>
              )}
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <i class="bi bi-geo-alt"></i> {view.mapType}
              </p>
              <p>
                <i className="bi bi-envelope"></i> {view.mail}
              </p>
              <p>
                <i className="bi bi-telephone"></i> {view.contact}
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{
        backgroundColor: '#797979', color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
      }}>
        © 2024 Project by: <span className='text-reset fw-bold'>Group 2</span>
      </div>
    </MDBFooter>
  );
}
