import { NextRequest, NextResponse } from 'next/server';
import { LOVENSE } from '../../config';
import axios from 'axios';

export async function POST(req: NextRequest) {

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {

        // Make the POST request with the data
        const response = await axios.post('https://api.lovense-api.com/api/basicApi/getToken', {
                token: LOVENSE.LOVENSE_API_TOKEN,
                uid: LOVENSE.LOVENSE_UID,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200 ) {
            return NextResponse.json({ error: 'Failed to send data' }, { status: response.status });
        }

        // Handle successful POST request (may involve further processing on the server)
        const responseData = response.data;
        return NextResponse.json({ message: responseData }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


