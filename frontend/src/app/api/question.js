import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:8084/api/v1/admin/questions';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwidXNlcl9pZCI6MSwiZW1haWwiOiJuaW1pdHRhbmJvb3V0b3JAZ21haWwuY29tIiwiaWF0IjoxNzM5ODA5MTc1LCJleHAiOjE3Mzk4OTU1NzV9._wgSlvwf7J7CCGFdU8kntySl_DFV8SLQnTBWx393fS4';

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}` 
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const response = await fetch(`${API_URL}/list`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${ACCESS_TOKEN}` 
            }
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}