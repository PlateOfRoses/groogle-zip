import { cookies } from 'next/headers';
import styles from './style.module.css'
import { fetchHeroAliases, fetchTeamList, fetchVideoFeed } from '@/app/actions/fetch';
import { refresh } from 'next/cache';

let hero_alias = {};
let team_alias = {};
let teams = [];
let videos = [];
let pageToken = "";

export default async function Page() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access');
    if (!access_token || access_token.value !== process.env.ACCESS_KEY) { 
        return <main>
            <form action={authAction}>
                <input type="text" name="access" />
                <input type="submit"></input>
            </form>
        </main>
    }
    
    return <main>
        <button onClick={deauthAction}>STOP!</button>
        <div className={styles.mainContent}>
            <form action={loadVideoAction}>
                <input style={{width: "400px"}}type="text" value={pageToken} placeholder="Page Token" name="nextPageToken" onChange={onChangeAction}/>
                <input type="submit" title="Load New Video"/>
            </form>
            <VideoList>

            </VideoList>
        </div>
    </main>;
}

export async function VideoList() {
    let render_videos = [];

    for (let index in videos) {
        const video = videos[index];
        
        let valid = false;
        let heroes = video.heroes[0][1].toLowerCase().replace(/\s/gi, "").split(",").filter(h => !(h in hero_alias));

        if (!valid) {
            render_videos.push(
                <div key={video.id} className={styles.video_invalid}>
                    <img src={`https://i.ytimg.com/vi/${video.id}/default.jpg`}/>
                    <TeamAlias team={video.team[1]}/>
                    <TeamAlias team={video.team[2]}/>
                    <Heroes hero_list={heroes}/>
                </div>
            )
        }
    }
    
    return <main className={styles.main_box}>
        <div className={styles.youtube}>
            {render_videos}
            <button>Submit All Videos</button>
        </div>
        <HeroAliases/>
        <Teams/>
    </main>;
}

export async function Heroes({ hero_list }) {
    const d = [];
    for (const hero of hero_list) {
        d.push(
            <div key={hero} className={styles.addHeroDiv}>
            <form action={addHeroAliasAction}>
                <input style={{display: 'none'}} name="alias" id="alias" value={hero} readOnly></input>
                <select id="hero" name="hero">
                    <option value="Ana">Ana</option>
                    <option value="Ashe">Ashe</option>
                    <option value="Baptiste">Baptiste</option>
                    <option value="Bastion">Bastion</option>
                    <option value="Brigette">Brigette</option>
                    <option value="Cassidy">Cassidy</option>
                    <option value="D.Va">D.Va</option>
                    <option value="Doomfist">Doomfist</option>
                    <option value="Echo">Echo</option>
                    <option value="Freja">Freja</option>
                    <option value="Genji">Genji</option>
                    <option value="Hanzo">Hanzo</option>
                    <option value="Hazard">Hazard</option>
                    <option value="Illari">Illari</option>
                    <option value="Junker Queen">Junker Queen</option>
                    <option value="Junkrat">Junkrat</option>
                    <option value="Juno">Juno</option>
                    <option value="Kiriko">Kiriko</option>
                    <option value="Lifeweaver">Lifeweaver</option>
                    <option value="Lucio">Lucio</option>
                    <option value="Mauga">Mauga</option>
                    <option value="Mei">Mei</option>
                    <option value="Mercy">Mercy</option>
                    <option value="Moira">Moira</option>
                    <option value="Orisa">Orisa</option>
                    <option value="Pharah">Pharah</option>
                    <option value="Ramattra">Ramattra</option>
                    <option value="Reaper">Reaper</option>
                    <option value="Reinhardt">Reinhardt</option>
                    <option value="Roadhog">Roadhog</option>
                    <option value="Sigma">Sigma</option>
                    <option value="Sojourn">Sojourn</option>
                    <option value="Soldier:76">Soldier: 76</option>
                    <option value="Sombra">Sombra</option>
                    <option value="Symmetra">Symmetra</option>
                    <option value="Torbjorn">Torbjorn</option>
                    <option value="Tracer">Tracer</option>
                    <option value="Vendetta">Vendetta</option>
                    <option value="Venture">Venture</option>
                    <option value="Widowmaker">Widowmaker</option>
                    <option value="Winston">Winston</option>
                    <option value="Wrecking">Wrecking Ball</option>
                    <option value="Wuyang">Wuyang</option>
                    <option value="Zarya">Zarya</option>
                    <option value="Zenyatta">Zenyatta</option>
                </select>
                <input type='submit' value={hero}/>
            </form>
            </div>

        )
    }
    return d;
}

async function Teams() {
    const d = [];
    for (let team of teams) {
        d.push(<ul>{team}</ul>);
    }
    return <div className={styles.heroAliasBox}>
        <a>TEAMS</a>
        <form action={addTeamAction}>
            <input type="text" name="team" placeholder="Team Name"/>
            <input type="submit" value="Submit"/>
        </form>
        <ul>
            {d}
        </ul>
        <form action={loadTeamsAction}>
            <input type="submit" value="Update Teams"/>
        </form>
    </div>
}

async function HeroAliases() {
    const reversed = {};

    for (const alias in hero_alias) {
        const hero_name = hero_alias[alias];
        if (hero_name in reversed) {
            reversed[hero_alias[alias]].push(<li key={alias}>{alias}</li>);
        } else {
            reversed[hero_alias[alias]] = [<li key={alias}>{alias}</li>];
        }
    }
    const d = [];
    for (const hero in reversed) {
        d.push(
            <div key={hero} className={styles.heroAliases}>
                {hero}
                {reversed[hero]}
            </div>
        )
    }
    return <div className={styles.heroAliasBox} style={{color: 'white'}}>
            <a>HEROES</a>
            <ul>
                {d}
            </ul>
            <form action={loadHeroAliasAction}>
                <input type="submit" value="Update Hero Alias"/>
            </form>
        </div>;
}

export async function TeamAlias(team) {
    return <div>
        <form action={addTeamAliasAction}>
            <input value={team.team} style={{display: 'none'}} name='name' readOnly/>
            <input name="alias" type="text"/>
            <input type="submit" title={team.team} value={team.team}/>
        </form>
        <a></a>
    </div>;
}

// ACTIONS
async function onChangeAction() {
    'use server';
}

async function addTeamAction(formData) {
    'use server';

    const cooki = await cookies();
    const access = cooki.get('access').value;

    var newHeaders = new Headers();
    newHeaders.append("Access-Key", access);
    
    teams.push(formData.get('team'));

    const res = await fetch('http://localhost:3000/api/mysql/teams', {method: 'POST', headers: newHeaders, body: JSON.stringify({team: formData.get('team')})});

    refresh();
}

async function loadTeamsAction() {
    'use server';

    const cooki = await cookies();
    const access = cooki.get('access').value;

    teams = await fetchTeamList(access);

    refresh();
}

async function addTeamAliasAction() {
    'use server';

    const cooki = await cookies();
    const access = cooki.get('access').value;
    
    var newHeaders = new Headers();
    newHeaders.append("Access-Key", access);
    
    hero_alias[formData.get('alias')] = formData.get('name');

    const res = await fetch('http://localhost:3000/api/mysql/teams', {method: 'POST', headers: newHeaders, body: JSON.stringify({hero: formData.get('name'), alias: formData.get('alias')})});
    if (!res.ok) {
        return null;
    }
    const x = await res.json();
    
    refresh();
}

async function addHeroAliasAction(formData) {
    'use server';

    const cooki = await cookies();
    const access = cooki.get('access').value;
    
    var newHeaders = new Headers();
    newHeaders.append("Access-Key", access);
    
    hero_alias[formData.get('alias')] = formData.get('hero');

    const res = await fetch('http://localhost:3000/api/mysql/heroes', {method: 'POST', headers: newHeaders, body: JSON.stringify({hero: formData.get('hero'), alias: formData.get('alias')})});
    if (!res.ok) {
        return null;
    }
    const x = await res.json();
    console.log(x);

    refresh();
}

async function loadVideoAction(formData)  {
    'use server';

    const nextPageToken = formData.get('nextPageToken');

    const cooki = await cookies();
    const access = cooki.get('access').value;

    console.log(nextPageToken);

    const res = await fetchVideoFeed(access, nextPageToken);

    videos = res.videos;
    pageToken = res.nextPageToken;

    refresh();
}   

export async function loadHeroAliasAction() {
    'use server';

    const cooki = await cookies();
    const access = cooki.get('access').value;

    hero_alias = await fetchHeroAliases(access);

    refresh();
}

async function authAction(formData) {
    'use server';

    const access_token = formData.get('access')

    const cookieStore = await cookies();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const access = cookieStore.set('access', access_token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

async function deauthAction() {
    'use server';

    const cookiesStore = await cookies();
    cookiesStore.delete('access');
}

