export async function GET(request) {
    const { rateLimited } = await checkRateLimit(request);

    if (rateLimited) {
        return NextResponse.json({ error: 'Rate Limit Exceeded '}, { status: 429 });
    }

    const data = JSON.parse(fs.readFileSync('./povs.json', { encoding: 'utf8', flag: 'r' }));
    return Response.json(data);
}


export async function POST(request) {
    if (process.env.ACCESS_KEY !== request.headers['access-key']) {
        return new Response("No Authorisation", { status: 401 });
    }
    const x = await request.json();
    
    return Response.json(data);
}