import React, { createContext, useState, useEffect } from 'react';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize your Socket.IO client here
    const newSocket = io('http://your-socket-server-url'); // Replace with actual URL
    setSocket(newSocket);

    // Cleanup function to disconnect socket when component unmounts
    return () => newSocket.disconnect();
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketContext;
