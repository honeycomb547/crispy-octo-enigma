import { NextRequest, NextResponse } from 'next/server';
import io from 'socket.io-client';

export async function POST(req: NextRequest) {

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
    const data = await req.json();
    const socket = io(data.socketURL, { path: '/developer.io', transports: ['websocket'] });
    try {
        const ackId = '24fsf2536fs7324hj647f5'

        socket.emit('basicapi_get_qrcode_ts', {
          ackId: ackId
        })
        
        socket.on('basicapi_get_qrcode_tc', res => {
          let resData = res ? JSON.parse(res) : {}
          if (resData.data && resData.data.ackId === ackId) {
            return NextResponse.json({ socketUrl: data.socketURL, resData }, { status: 200 });
          }
        });

    } catch (error) {
        console.error('Error fetching socket data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        // Close the socket connection
        socket.close();
    }
}


