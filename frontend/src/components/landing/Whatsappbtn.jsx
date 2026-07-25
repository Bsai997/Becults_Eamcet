import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
export default function WhatsAppButton() {
//   const phoneNumber = "8179071864"; // Include country code, no + or spaces
  const whatsappUrl = `https://wa.me/918179071864?text=Hi`; // Remove non-digit characters

  const buttonStyle = {
    position: 'fixed',
    bottom: '50px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#25d366',
    gradient :'linear-gradient(135deg, #25d366, #128c7e)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 10px 10px #bdf2c3',
    zIndex: 1000,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  };

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={buttonStyle}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      
<FaWhatsapp style={{ color: '#fff', fontSize: '35px' }} />

    </a>
  );
}
