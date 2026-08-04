import {NextResponse} from "next/server";
import { XMLParser} from "fast-xml-parser";

export async function GET(request) {
    const challenge = request.nextUrl.searchParams.get('hub.challenge');
    if (request.nextUrl.searchParams.get('hub.challenge') == process.env.ACCESS_TOKEN) {
        return new Response(challenge);
    }
    return new Response(401)
}

export async function POST(request) {
    const body = await request.text();
    if (!body) {
        return NextResponse.json({ error: "Empty Body"}, { status: 400 });
    }

    const parser = new XMLParser();
    const jsonData = parser.parse(body);

    const video_id = jsonData.feed.entry['yt:videoId'];

    const add_video = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/addvideo?id=${video_id}&access=${process.env.ACCESS_TOKEN}`, {method: "get"});

    return new Response(null, { status: 204 });
}