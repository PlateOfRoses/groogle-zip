
export async function fetchVideoFeed(token, nextPage) {
    var newHeaders = new Headers();
    newHeaders.append("Access-Key", token);
    newHeaders.append("Next-Page-Token", nextPage);

    const res = await fetch('http://localhost:3000/api/povs/generate', {method: 'GET', headers: newHeaders});
    if (!res.ok) {
        return null;
    }
    const x = await res.json();
    return x;
}

export async function fetchHeroAliases(token) {
    var newHeaders = new Headers();
    newHeaders.append("Access-Key", token);

    const res = await fetch('http://localhost:3000/api/mysql/heroes', {method: 'GET', headers: newHeaders});
    if (!res.ok) {
        return null;
    }
    const x = await res.json();
    return x;
}

export async function fetchTeamList(token) {
    var newHeaders = new Headers();
    newHeaders.append("Access-Key", token);

    const res = await fetch('http://localhost:3000/api/mysql/teams', {method: 'GET', headers: newHeaders});
    if (!res.ok) {
        return null;
    }
    const x = await res.json();
    return x;
}