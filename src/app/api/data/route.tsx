import { NextRequest, NextResponse } from 'next/server';
import { LOVENSE } from '../../config';

export async function POST(req: NextRequest) {

    // Check if the request method is POST
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {

        // Make the POST request with the data
        const response = await fetch(LOVENSE.LOVENSE_GET_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Set appropriate headers
            body: JSON.stringify({
                token: LOVENSE.LOVENSE_API_TOKEN,
                uid: LOVENSE.LOVENSE_UID,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to send data' }, { status: response.status });
        }

        // Handle successful POST request (may involve further processing on the server)
        const responseData = await response.json();
        return NextResponse.json({ message: responseData }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


