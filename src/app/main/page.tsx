import axios from 'axios';
import Link from 'next/link';
import io from 'socket.io-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    socket.emit('my event', { data: "I'm connected!" });
  });

  socket.emit('basicapi_get_qrcode_ts', {
    ackId: ackId
  });

  return socket;
}

export default async function Main() {
  // const socket = await getSocket();

  // socket.on('basicapi_update_device_info_tc', res => {
  //   let resData = res ? JSON.parse(res) : {}
  //   console.log(resData)
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Lovense Control</CardTitle>
            <CardDescription>Control the Lovense Here!</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="currentvibe">Current Vibe Level</Label>
                  <h3 id='currentvibe'></h3>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="chatoverride">Chat Override</Label>
                  <Input id="chatoverride" placeholder="Override Chat Input Here!" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="control">Controls</Label>
                  <Button>Stop Vibe</Button>
                  <Button>Resume Vibe</Button>
                  <Button>Reload</Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Override Chat</Button>
            <Link href="/overlay" passHref>
            <Button variant="secondary" >Stream Overlay</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
