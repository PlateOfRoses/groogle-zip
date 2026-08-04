import { NextResponse } from 'next/server';

const fs = require('fs');

export async function GET(request) {
    const { rateLimited } = await checkRateLimit(request);

    if (rateLimited) {
        return NextResponse.json({ error: 'Rate Limit Exceeded '}, { status: 429 });
    }
    const data = JSON.parse(fs.readFileSync('./twabs_dict.json', { encoding: 'utf8', flag: 'r' }));
    console.log(data);
    return Response.json(data);
}

export async function POST(request) {
    if (process.env.ACCESS_KEY !== request.headers['access-key']) {
        return new Response("No Authorisation", { status: 401 });
    }
    const x = await request.json();
    console.log(x.article_id);
    const data = {test: Math.floor(Math.random() * 1_000_000)};
    fs.writeFileSync('./twabs_dict.json', JSON.stringify(data), { encoding: 'utf8'});
    return Response.json(data);
}