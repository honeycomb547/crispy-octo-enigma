"use client";

import axios from 'axios';
import { io } from "socket.io-client";

async function getLovenseAuthToken() {
    const res = await axios.post('http://localhost:3000/api/get-lovense-auth-token', {
    });
  
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
  
    return res.data.message?.data?.authToken;
  };
  
  async function getLovenseSocketURL(lovenseAuthToken: string) {
    const res = await axios.post('http://localhost:3000/api/get-lovense-socket-url', {
      authToken: lovenseAuthToken,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
  
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    };
    return {
      'socketURL': res.data.message.data.socketIoUrl,
      'socketPath': res.data.message.data.socketIoPath
    };
  
  };

export async function LovenseSocket() {
    const lovenseAuthToken = await getLovenseAuthToken();
    const { socketURL, socketPath } = await getLovenseSocketURL(lovenseAuthToken);
    return io(socketURL, { path: socketPath, transports: ['websocket'] });
  }
