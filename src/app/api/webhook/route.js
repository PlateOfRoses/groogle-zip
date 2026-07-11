
export async function POST(request) {
    console.log(request.headers.get("access-key"));
    if (process.env.ACCESS_KEY !== request.headers.get('access-key')) {
        return new Response("No Authorisation", { status: 401 });
    }
    const data = await request.json();

    const payload = data.payload;
    console.log(data);
    if (!payload.entity.name.includes('OCE')) {
        return new Response({status: 200});
    }

    let embed = {
        "title": "X",
        "type": "rich",
        "description": `[${payload.teams[0].name} vs ${payload.teams[1].name}](https://www.faceit.com/en/ow2/room/${payload.id})`,
        "color": 111111,
    }
    console.log(payload);
    switch (data.event) {
        case "match_status_cancelled":
            embed.title = "CANCELLED";
            embed.color = 4294967295;
            break;
        case "match_status_configuring":
            embed.title = "CONFIGURING";
            embed.color = 14579716;
            break;
        case "match_status_finished":
            embed.title = "FINISHED";
            embed.color = 4960762;
            break;
        case "match_object_created":
            embed.title = "CREATED";
            embed.color = 10102484;
            break;
        case "match_status_ready":
            embed.title = "STARTING";
            break;
        default:
            new Response({status: 200});
    }



    const url = `https://discord.com/api/webhooks/${process.env.DISC_WEBHOOK}`;

    console.log(url)
    console.log({ 'embeds': [embed] })

    try {
        const req = new Request(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'embeds': [embed], "content": "", "attachments": [] })
        });

        const resp = await fetch(req);
        console.log(resp);

    } catch (e) {
        console.error(e);
    }

    return new Response({status: 200});
}