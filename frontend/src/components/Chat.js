import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import './style.css'

export const Chat = () => {
  const [sent, setSent] = useState('hello');
  const [received, setReceived] = useState('Hi');

  return (
    <main>
      <Container
        style={{
          display: 'block',
          border: '2px solid white',
          borderRadius: '10px',
          position: 'relative',
          top: '5vmax',
          height: '50%',
          backdropFilter: 'blur(50px)',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div className="messageBox">
          <div className='rMessage'>Received message: {received}</div>
          <br />
          <div className='sMessage'>Sent message: {sent}</div>
        </div>
        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <label>Enter message</label>
          <input className='accept' type='text' onChange={(e) => { setSent(e.value) }} />
        </div>
      </Container>
    </main>
  )
}
