export async function GET(request, { params }) {
    const game_id = (await params).slug;
    const url = `https://open.faceit.com/data/v4/matches/${game_id}/stats`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`,
            'Accept': 'application/json',
        },
    });
    const data = await response.json();

    const player_stats = {}
    const desired_stats =
        [
            "",
            "",
            "",
            "",
            ""
        ]


    for (let round of data.rounds) {
        for (let player of round.teams[0].players) {
            const nickname = player.nickname;
            if (player_stats[nickname] == undefined) {
                player_stats[nickname] = 0;
            }
            player_stats[nickname] += Math.floor(Number(player.player_stats["Eliminations"]) / 3)
            - Number(player.player_stats["Deaths"])
            + Math.floor((Number(player.player_stats["Healing Done"])
                + Number(player.player_stats["Damage Dealt"])) / 1000) / 2
        }
        for (let player of round.teams[1].players) {
            const nickname = player.nickname;
            if (player_stats[nickname] == undefined) {
                player_stats[nickname] = 0;
            }
            player_stats[nickname] += Math.floor(Number(player.player_stats["Eliminations"]) / 3)
                - Number(player.player_stats["Deaths"])
                + Math.floor((Number(player.player_stats["Healing Done"])
                    + Number(player.player_stats["Damage Dealt"])) / 1000) / 2
        }
    }

    let xmlBody = "Name,Points\n"

    for (let player in player_stats) {
        xmlBody +=  `${player},${player_stats[player]}\n`;
    }

    return new Response(xmlBody, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        }
    })
}
