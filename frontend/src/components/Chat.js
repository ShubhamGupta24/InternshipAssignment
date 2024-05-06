import React, { useEffect, useState } from 'react';
import { LuArrowRightCircle } from "react-icons/lu";
import io from "socket.io-client"
import { Container } from 'react-bootstrap';
import './style.css'


const socket = io.connect("http://localhost:5000"); // Connect to our server


export const Chat = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState('');
  const [received, setReceived] = useState('');

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room)
    }
    else
      alert("Room Code Not Entered");
  };

  const sendMessage = () => {
    console.log('Message sent', message)
    if (message !== '') {
      socket.emit("send_message", { message, room });
    }
    else
      alert('message not found');
  };

  const disConnect = () => {
    if (room !== '') {
      console.log("Leave room from frontend")

      socket.emit('leave_room', room)
    }
    else
      alert('Please Join a Room First')
  }

  useEffect(() => {
    console.log("UseEffect")
    socket.on("receive_message", (data) => {
      console.log("Message Received", data);
      setReceived(data);
    }, [socket])
  })

  return (
    <div className='main'>
      <Container
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid white',
          borderRadius: '10px',
          position: 'relative',
          height: '60%',
          backdropFilter: 'blur(50px)',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
        <h1 style={{ margin: '10px', padding: '15px' }}>
          Let's Chat
        </h1>
        <div className='acceptBox'>
          <label style={{ color: 'white' }} >Enter Room Code</label>
          <input className='accept' type='text' onChange={(e) => { setRoom(e.target.value) }} />
          <button style={{
            border: "none", background: 'transparent', color: 'white', cursor: 'pointer'
          }} onClick={joinRoom}>
            <LuArrowRightCircle style={{ width: '35px', height: '35px' }} /></button>
        </div>
        <div className="messageBox">
          <div className='rMessage'>Received message: {received}</div>
          <div className='sMessage'>Sent message: {message}</div>
        </div>
        <div className='acceptBox'>
          <label style={{ color: 'white' }} >Enter message</label>
          <input className='accept' type='text' onChange={(e) => { setMessage(e.target.value) }} />
          <button style={{
            border: "none", background: 'transparent', color: 'white', cursor: 'pointer'
          }} onClick={sendMessage}>
            <LuArrowRightCircle style={{ width: '35px', height: '35px' }} /></button>
        </div>
        <button className='bttn' onClick={disConnect}>Leave Room</button>
      </Container>
    </div>
  )
}
