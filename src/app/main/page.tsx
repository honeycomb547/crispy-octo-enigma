"use client";
import Link from 'next/link';
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
import { useState } from 'react';
import axios from 'axios';
import MyComponent from '../socket-test/page';

const ackId = '24fsf2536fs7324hj647f5';

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


export default async function Main() {
  const authToken = await getLovenseAuthToken();
  const { socketURL, socketPath } = await getLovenseSocketURL(authToken);
  const vibeLevel = '0';
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="mb-32 grid text-center  lg:max-w-5xl  lg:text-left">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Lovense Control</CardTitle>
            <CardDescription>Control the Lovense Here!</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="currentvibe">Current Vibe Level: {vibeLevel}</Label>
                  <h3 id='currentvibe'></h3>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="chatoverride">Chat Override</Label>
                  <Input id="chatoverride" placeholder="Override Chat Input Here!" />
                </div>
                <div className="flex flex-col space-y-2">
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
              <Button variant="secondary">Stream Overlay</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <MyComponent socketPath={socketPath} socketURL={socketURL} />
    </main>
  );
}
