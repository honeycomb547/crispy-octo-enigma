import axios from 'axios';
import io  from 'socket.io-client';

const ackId = '24fsf2536fs7324hj647f5';

async function getLovenseAuthToken() {
  const res = await axios.post('http://localhost:3000/api/get-lovense-auth-token', {
  });

  if (res.status !== 200) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.data;
};

async function getLovenseSocketURL() {
  const lovenseAuthToken = await getLovenseAuthToken();
  const res = await axios.post('http://localhost:3000/api/get-lovense-socket-url', {
    authToken: lovenseAuthToken.message?.data?.authToken,
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
  return res.data.message.data.socketIoUrl;

};


export async function getSocket() {
  const socketURL = await getLovenseSocketURL();
  const socket = io(socketURL, { path: '/developer.io', transports: ['websocket'] });


  socket.on('connect', () => {
      socket.emit('my event', {data: "I'm connected!"});
  });

  socket.emit('basicapi_get_qrcode_ts', {
    ackId: ackId
  });

  return socket;
}

export default async function Main() {
  const socket = await getSocket();
  
  socket.on('basicapi_update_device_info_tc', res => {
    let resData = res ? JSON.parse(res) : {}
    console.log(resData)
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Meme
        </p>
      </div>


      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
      <button>Stop Vibe</button>
      <button style={{ marginLeft: 10 }}>Resume Vibe</button>
      <button style={{ marginLeft: 10 }}>Reload</button>
      <button style={{ marginLeft: 10 }}>Open Overlay Page</button>
      </div>
    </main>
  );
}
