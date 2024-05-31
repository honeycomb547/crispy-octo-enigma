"use client";
import { useContext, useEffect, useState } from 'react';
import SocketContext from "../socketContext";

export default function ChatPage() {
  const socket = useContext(SocketContext);
  const [vibeLevelText, setVibeLevelText] = useState('Test Text');

  useEffect(() => {
    if (socket) {
      // Handle events and other socket interactions here
      socket.on('connect', function () {
        socket.emit('my event', { data: "I'm connected!" });
      });
      socket.on('reload', function (res) {
        document.location = document.location;
      });
      socket.on('battle', function (res) {
        console.log('Battle Result: ' + res);
      });
      socket.on('vibestat', (res) => {
        console.log("vibestat", res);

        const connectedIcon = !res.connected ? '' : res.online ? '' : '';
        const vibeText = `vibe at ${res.level} from `;

        let vibeLevelContent;
        if (res.controller) {
          const span = document.createElement('span');
          span.innerText = res.controller;
          span.classList.add('name');
          vibeLevelContent = [vibeText, span, connectedIcon];
        } else {
          vibeLevelContent = [vibeText, connectedIcon];
        }

        setVibeLevelText(vibeLevelContent.join('')); // Efficient string concatenation
      });
    }

    // No cleanup function needed as socket is managed externally
  }, [socket]);
  return (
    <body className="vibeMessage shadow-md shadow-inner shadow-black-500 shadow-orange-400 shadow-gray-500">
    <div>
      <h2 id="vibelevel" className="vibeMessage font-child-chat">{vibeLevelText}</h2>
      <pre id="battletext" className="vibeMessage font-child-chat"></pre>
    </div>
    </body>
  );
}

