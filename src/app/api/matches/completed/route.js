import fs from "fs";

const games = JSON.parse(fs.readFileSync('./src/app/lib/faceit_games.json', { encoding: 'utf8', flag: 'r' }));

export async function GET(request) {
    const page = request.nextUrl.searchParams.get('page');
    const division = request.nextUrl.searchParams.get('division');

    const open_matches = games.opens.completed.reverse();
    const master_matches = games.opens.completed.reverse();

    switch (division) {
        case 'opens':
            let sorted = sort_matches(open_matches);
            break;
        case 'masters':
            sorted = sort_matches(master_matches);
            break;
        default:
            sorted = sort_matches(master_matches.concat(open_matches));
            break;
    }

    return new Response(page);
}

function sort_matches(match_array) {
    const pivot = games.games[match_array[0]];
    const lower = []
    const higher = []
    for (const match of match_array.splice(1, match.length - 1)) {
        if (games.games[match].date <= pivot) {
            lower.push(match);
        } else {
            higher.push(match);
        }
    }
    return sort_matches(lower).concat([pivot].concat(higher));
}