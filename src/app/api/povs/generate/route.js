import { ErrorBoundaryHandler } from "next/dist/client/components/error-boundary";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    if (request.headers.get('access-key') !== process.env.ACCESS_KEY) {
        return NextResponse.json({status: 403});
    }
    console.log(request.headers);
    let pageToken = request.headers.get('next-page-token');
    let continue_search = true;
    let key = process.env.YOUTUBE_KEY;
    let elements = [];

    const chapter_regex = /(.*?): (\d{1,2}:\d{1,2}:?\d{0,2})/gi;
    const hero_regex = /Heroes played: (.*)/gi;
    const player_regex = /\[\s*([^\s\]]*?)\s|]/gi;
    const team_regex = /([\w\s\.]*?)vs(?![\w\W].*?vs)([\w\s\.]*?)(?:[^\w\s]|$)/gi;
    const backup_team = /([\w\s\.]*?)vs([\w\s\.]*?)[^\w\s]/gi;

    console.log(pageToken);

    while (continue_search) {
        try {
            let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=id&playlistId=UUWcMwj6iZCuQ8Klgd42P2Dg&key=${key}&order=date&maxResults=50`;
            if (pageToken) {
                url = `${url}&pageToken=${pageToken}`;
            } 
            const res = await fetch(url);
            const data = await res.json();

            pageToken = data.nextPageToken;

            for (let video of data.items) {
                const snippet = video.snippet;
                if (!snippet.title.includes("[") || snippet.title.includes('Ranked POV') || snippet.title.includes('ObsSoj') || snippet.title.includes('Lofi'))  {
                    break;
                }
                const date = Math.floor(new Date(video.snippet.publishedAt).getTime() / 1000);
                const teams = [...snippet.title.matchAll((snippet.title.includes('JPN vs PAC')  ? backup_team : team_regex))];
                const player = [...snippet.title.matchAll(player_regex)];
                
                if (video.snippet.resourceId.kind === "youtube#video") {
                    const temp = {
                        id: snippet.resourceId.videoId,
                        player: player[0][1],
                        heroes: [...snippet.description.matchAll(hero_regex)],
                        team: teams[0],
                        pub: date,
                        maps: [...snippet.description.matchAll(chapter_regex)],
                    }
                    elements.push(temp)
                }
            }
            continue_search = false;
        } catch (error) {
            console.log(error);
            continue_search = false;
        }
    }
    return NextResponse.json({videos: elements, nextPageToken: pageToken}, { status: 200 });
}