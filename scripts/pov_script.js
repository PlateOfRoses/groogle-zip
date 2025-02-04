function get_time(unix_time) {
    const date = new Date(unix_time * 1000);

    return date.toLocaleDateString();
}


async function onload() {
    await get_povs();
    const total = document.getElementById("total-povs");
    total.innerText = total.innerText.replace("{povs}", Object.keys(entries.content).length);
    populate_povs();
    populate_filters();
}

async function get_povs() {
	const url = "https://raw.githubusercontent.com/PlateOfSuki/OWCSPlayerPOVS/refs/heads/main/data.json";
	await apiRequest(url).then(function(response) {
		entries = structuredClone(response);
	});
}

async function addthings(v, k, dropdown, filter, type) {
    let filt = document.createElement('option');
    filt.value = v;
    filt.id =  type + "_" + v;
    filt.innerHTML = v + " (" + filter[v].length + ")";
    dropdown.appendChild(filt, "player");
}


async function populate_filters() {
    player_dropdown = document.getElementById("playerselect");
    Object.keys(entries.filters.player).sort().forEach(function(k,v) {
        addthings(k, v, player_dropdown, entries.filters.player, "player");
    })
    player_dropdown.onchange = function(e){hide_miscreants(e);}


    hero_dropdown = document.getElementById("heroselect");
    Object.keys(entries.filters.heroes).sort().forEach(function(k, v) {
        addthings(k, v, hero_dropdown, entries.filters.heroes, "hero");
    })
    hero_dropdown.onchange = function(e){hide_miscreants(e);}

    region_dropdown = document.getElementById("regionselect");
    Object.keys(entries.filters.region).sort().forEach(function(k, v) {
        addthings(k, v, region_dropdown, entries.filters.region, "region");
    })
    region_dropdown.onchange = function(e){hide_miscreants(e);}

    stakes_dropdown = document.getElementById("stakesselect");
    Object.keys(entries.filters.stakes).sort().forEach(function(k, v) {
        addthings(k, v, stakes_dropdown, entries.filters.stakes, "stakes");
    })
    stakes_dropdown.onchange = function(e){hide_miscreants(e);}

    team_dropdown = document.getElementById("teamselect");
    Object.keys(entries.filters.team).sort().forEach(function(k, v) {
        addthings(k, v, team_dropdown, entries.filters.team, "team");
    })
    team_dropdown.onchange = function(e){hide_miscreants(e);}

    enemy_dropdown = document.getElementById("enemyselect");
    Object.keys(entries.filters.enemy).sort().forEach(function(k, v) {
        addthings(k, v, enemy_dropdown, entries.filters.enemy, "enemy");
    })
    enemy_dropdown.onchange = function(e){hide_miscreants(e);}

    tourn_dropdown = document.getElementById("tournselect");
    Object.keys(entries.filters.tournament).sort().forEach(function(k, v) {
        addthings(k, v, tourn_dropdown, entries.filters.tournament, "tourn");
    })
    tourn_dropdown.onchange = function(e){hide_miscreants(e);}

    maps_dropdown = document.getElementById("mapsselect");
    Object.keys(entries.filters.maps).sort().forEach(function(k, v) {
        addthings(k, v, maps_dropdown, entries.filters.maps, "maps");
    })
    maps_dropdown.onchange = function(e){hide_miscreants(e);}
}

async function populate_povs() {
    for (let i in Object.keys(entries.content)) {
        add_video(i, entries.content[i]);
    }
}

// this might be the most disgusting thing ive made icl
function get_allowed_videos() {
    const player = entries.filters.player[document.getElementById("playerselect").value];
    const hero = entries.filters.heroes[document.getElementById("heroselect").value];
    const region = entries.filters.region[document.getElementById("regionselect").value];
    const stakes = entries.filters.stakes[document.getElementById("stakesselect").value];
    const team = entries.filters.team[document.getElementById("teamselect").value];
    const enemy = entries.filters.enemy[document.getElementById("enemyselect").value];
    const tourn = entries.filters.tournament[document.getElementById("tournselect").value];
    const maps = entries.filters.maps[document.getElementById("mapsselect").value];

    let x = player.concat(hero).concat(region).concat(stakes).concat(team).concat(enemy).concat(tourn).concat(maps);

    return get_max_occurances(x, 8);
}

async function hide_miscreants(event) {
    thing = get_allowed_videos();
    const results = document.getElementsByClassName('result');
    for (let i in Object.keys(results)) {
        if (results[i].style != undefined) {
            if (thing.includes(results[i].id)) {
                results[i].style.display = 'block';
            } else {
                results[i].style.display = 'none';
            }
        }
    }
    const filters = document.getElementsByClassName('filterselect');
    for (let i in Object.keys(filters)) {
        for (let fl in Object.keys(filters[i])) {
            if (filters[i].id != event.target.id || event.target.value == filters[i][fl].value) {
                let b = get_with(filters[i].id, filters[i][fl].value);
                filters[i][fl].innerHTML = filters[i][fl].value + " (" + b.length + ")";
                if (b.length == 0) {
                    filters[i][fl].style.display = 'none';
                } else {
                    filters[i][fl].style.display = 'block';
                }
            }
        }
    }

}

//maybe this is
function get_with(missing, values) {
    let player = entries.filters.player[document.getElementById("playerselect").value];
    let hero = entries.filters.heroes[document.getElementById("heroselect").value];
    let region = entries.filters.region[document.getElementById("regionselect").value];
    let stakes = entries.filters.stakes[document.getElementById("stakesselect").value];
    let team = entries.filters.team[document.getElementById("teamselect").value];
    let enemy = entries.filters.enemy[document.getElementById("enemyselect").value];
    let tourn = entries.filters.tournament[document.getElementById("tournselect").value];
    let maps = entries.filters.maps[document.getElementById("mapsselect").value];
    if (missing == "playerselect") {
        player = entries.filters.player[values];
    }
    if (missing == "heroselect") {
        hero = entries.filters.heroes[values];
    }
    if (missing == "regionselect") {
        region = entries.filters.region[values];
    }
    if (missing == "stakesselect") {
        stakes = entries.filters.stakes[values];
    }
    if (missing == "teamselect") {
        team = entries.filters.team[values];
    }
    if (missing == "enemyselect") {
        enemy = entries.filters.enemy[values];
    }
    if (missing == "tournselect") {
        tourn = entries.filters.tournament[values];
    }
    if (missing == "mapsselect") {
        maps = entries.filters.maps[values];
    }

    let x = player.concat(hero).concat(region).concat(stakes).concat(team).concat(enemy).concat(tourn).concat(maps);

    let a = get_max_occurances(x, 8);
    return a;
}

function get_max_occurances(arr, theo) {
    const count = {};
    for (const num of arr) {
        count[num] = count[num] ? count[num] + 1 : 1;
    }
    let max = 0;
    const counted = {}
    for (const [k, v] of Object.entries(count)) {
        max = v > max ? v : max;
        if (counted[v]) {
            counted[v].push(k);
        } else {
            counted[v] = [k];
        }
    }
    if (max >= theo) {
        return counted[max];
    }
    return [];
}

async function add_video(id, video) {
    const container = document.getElementById("results");
    var div = document.createElement('div');
    div.id = id;
    div.className = 'result';
    const date = new Date(video.publishedAt*1000);
    let inner = "<div class='resultflex' loading='lazy'><div class='painbox'><a href='https://youtu.be/" + video.id + "'><img class='resultimage' src='" + video.thumbnail.url + "' loading='lazy' ></a></div>" +
                "<div class='videoinfo' ><a href='https://youtu.be/" + video.id + "'><h3 class='videotitle'>" + video.title +"</h3></a>" +
                "<div class='videostats'>" +
                "<h4 class='matchinfo'><i>" + video.team + "</i> " + video.player + " vs " + video.enemy + "</h4>" +
                "<h4 class='tourn'>" + video.tournament + "</h4>" +
                (video.stakes == "None" ? "" : "<h4 class='tourn'>" + video.stakes + "</h4>") +
                "<h4 class='uploaded'> Uploaded: " + days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " " + (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" + (date.getSeconds() < 10 ? "0": "" ) + date.getSeconds() + (date.getHours() > 12 ? "pm" : "am") + "</h4>" +
                "</div><div class='herocontainer'>";


    for (let hero in Object.keys(video.heroes)) {
        inner += "<div class='herocard' onclick='onheroclick(this)'><div class='heroclickable' id='" + video.heroes[hero] + "'></div><img src='" + hero_icons[video.heroes[hero]] + "' class='heroimage'><a>" + video.heroes[hero] +
                "</a></div>"
    }

    inner += "</div><br><div class='mapcontainer'>"

    for (let hero in Object.keys(video.maps)) {
        inner += "<div class='mapholder'><div class='maptext'><a>" + video.maps[hero] + "</a></div><div class='mapcard'></div></div>"
    }

    inner += "</div></div><div class='resultbackground'></div></div>";

    div.innerHTML = inner;
    container.appendChild(div)
}

async function onheroclick(e) {
    document.getElementById("heroselect").value = e.childNodes[0].id;
    a = document.getElementById('hero_' + e.childNodes[0].id)
    hide_miscreants({target: a});
}

function apiRequest(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
	return new Promise(function(resolve, reject) {
		request.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				let json = JSON.parse(this.responseText);
				resolve(json)
			} else {
				resolve.onerror = reject;
			}
		}
		request.send();
	});
}

const hero_icons = {"Hazard":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/612ae1e6d28125bd4d4d18c2c4e5b004936c094556239ed24a1c0a806410a020.png",
                    "Ana":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/3429c394716364bbef802180e9763d04812757c205e1b4568bc321772096ed86.png",
                    "Ashe":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/8dc2a024c9b7d95c7141b2ef065590dbc8d9018d12ad15f76b01923986702228.png",
                    "Baptiste":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/f979896f74ba22db2a92a85ae1260124ab0a26665957a624365e0f96e5ac5b5c.png",
                    "Bastion":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/4d715f722c42215072b5dd0240904aaed7b5285df0b2b082d0a7f1865b5ea992.png",
                    "Brigitte":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/48392820c6976ee1cd8dde13e71df85bf15560083ee5c8658fe7c298095d619a.png",
                    "Cassidy":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/6cfb48b5597b657c2eafb1277dc5eef4a07eae90c265fcd37ed798189619f0a5.png",
                    "D.va":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/ca114f72193e4d58a85c087e9409242f1a31e808cf4058678b8cbf767c2a9a0a.png",
                    "Doomfist":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/13750471c693c1a360eb19d5ace229c8599a729cd961d72ebee0e157657b7d18.png",
                    "Echo":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/f086bf235cc6b7f138609594218a8385c8e5f6405a39eceb0deb9afb429619fe.png",
                    "Genji":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/4edf5ea6d58c449a2aeb619a3fda9fff36a069dfbe4da8bc5d8ec1c758ddb8dc.png",
                    "Hanzo":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/aecd8fa677f0093344fab7ccb7c37516c764df3f5ff339a5a845a030a27ba7e0.png",
                    "Illari":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/5ea986038f9d307bd4613d5e6f2c4c8e7f15f30ceeeabbdd7a06637a38f17e1f.png",
                    "Junkerqueen":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/cef2406b2244b80506f83b8fb9ebaf214f41fa8795cbeef84026cd8018561d04.png",
                    "Junkrat":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/037e3df083624e5480f8996821287479a375f62b470572a22773da0eaf9441d0.png",
                    "Juno":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/585b2d60cbd3c271b6ad5ad0922537af0c6836fab6c89cb9979077f7bb0832b5.png",
                    "Kiriko":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/088aff2153bdfa426984b1d5c912f6af0ab313f0865a81be0edd114e9a2f79f9.png",
                    "Lifeweaver":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/39d4514f1b858bc228035b09d5a74ed41f8eeefc9a0d1873570b216ba04334df.png",
                    "Lucio":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/e2ff2527610a0fbe0c9956f80925123ef3e66c213003e29d37436de30b90e4e1.png",
                    "Mauga":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/9ee3f5a62893091d575ec0a0d66df878597086374202c6fc7da2d63320a7d02e.png",
                    "Mei":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/1533fcb0ee1d3f9586f84b4067c6f63eca3322c1c661f69bfb41cd9e4f4bcc11.png",
                    "Mercy":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/2508ddd39a178d5f6ae993ab43eeb3e7961e5a54a9507e6ae347381193f28943.png",
                    "Moira":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/000beeb5606e01497897fa9210dd3b1e78e1159ebfd8afdc9e989047d7d3d08f.png",
                    "Orisa":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/71e96294617e81051d120b5d04b491bb1ea40e2933da44d6631aae149aac411d.png",
                    "Pharah":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/f8261595eca3e43e3b37cadb8161902cc416e38b7e0caa855f4555001156d814.png",
                    "Ramattra":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/3e0367155e1940a24da076c6f1f065aacede88dbc323631491aa0cd5a51e0b66.png",
                    "Reaper":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/2edb9af69d987bb503cd31f7013ae693640e692b321a73d175957b9e64394f40.png",
                    "Reinhardt":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/490d2f79f8547d6e364306af60c8184fb8024b8e55809e4cc501126109981a65.png",
                    "Roadhog":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/72e02e747b66b61fcbc02d35d350770b3ec7cbaabd0a7ca17c0d82743d43a7e8.png",
                    "Sigma":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/cd7a4c0a0df8924afb2c9f6df864ed040f20250440c36ca2eb634acf6609c5e4.png",
                    "Sojourn":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/a53bf7ad9d2f33aaf9199a00989f86d4ba1f67c281ba550312c7d96e70fec4ea.png",
                    "Soldier: 76":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/20b4ef00ed05d6dba75df228241ed528df7b6c9556f04c8070bad1e2f89e0ff5.png",
                    "Sombra":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/bca8532688f01b071806063b9472f1c0f9fc9c7948e6b59e210006e69cec9022.png",
                    "Symmetra":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/7f2024c5387c9d76d944a5db021c2774d1e9d7cbf39e9b6a35b364d38ea250ac.png",
                    "Torbjorn":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/1309ab1add1cc19189a2c8bc7b1471f88efa1073e9705d2397fdb37d45707d01.png",
                    "Tracer":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/a66413200e934da19540afac965cfe8a2de4ada593d9a52d53108bb28e8bbc9c.png",
                    "Venture":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/7e33dd756c8a1abca519af6c3bf26813f2f81d39885373539efcf8442c4bc647.png",
                    "Widowmaker":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/a714f1cb33cc91c6b5b3e89ffe7e325b99e7c89cc8e8feced594f81305147efe.png",
                    "Winston":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/bd9c8e634d89488459dfc1aeb21b602fa5c39aa05601a4167682f3a3fed4e0ee.png",
                    "Wrecking Ball":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/5c18e39ce567ee8a84078f775b9f76a2ba891de601c059a3d2b46b61ae4afb42.png",
                    "Zarya":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/8819ba85823136640d8eba2af6fd7b19d46b9ee8ab192a4e06f396d1e5231f7a.png",
                    "Zenyatta":"https://d15f34w2p8l1cc.cloudfront.net/overwatch/71cabc939c577581f66b952f9c70891db779251e8e70f29de3c7bf494edacfe4.png",
                    "NONE": "https://www.cambridge.org/elt/blog/wp-content/uploads/2019/07/Sad-Face-Emoji-480x480.png.webp"}


const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let entries;
onload();
