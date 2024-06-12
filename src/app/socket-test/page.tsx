"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const MyComponent = ({ socketURL, socketPath }: { socketURL: string, socketPath: string }) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const socket = io(socketURL, { path: socketPath, transports: ['websocket'] });
    setSocket(socket);

    socket.on('connect', () => {
      socket.emit('sample_event', message, (response) => {
        setResponseData(response);
      });
    });

    return () => socket.disconnect();
  }, [message]); // Re-emit with updated message

  const handleSendMessage = () => {
    if (socket) {
      socket.emit('sample_event', message, (response) => {
        setResponseData(response);
        setMessage(''); // Clear message after sending
      });
    }
  };

  return (
    <div>
      <h1>Socket.IO Connection</h1>
      {socket ? (
        <div>
          <p>Connected!</p>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send Message</button>
          {responseData && <p>Server Response: {responseData}</p>}
        </div>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
};

export default MyComponent;