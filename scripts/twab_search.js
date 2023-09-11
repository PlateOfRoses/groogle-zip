var input = document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        if (!entries) {
            return false;
        }
        load_search();
        }
    }
)

function get_time(unix_time) {
    const date = new Date(unix_time * 1000);

    return date.toLocaleDateString();
}

async function get_hits(twabs, phrase) {
    const hits = {};
    const clean_phrase = phrase.replace(/['"’]/g,"").toLowerCase();
    for (let i in twabs) {
        const clean_text = decodeURIComponent(encodeURIComponent(twabs[i]['html'])).toLowerCase().replace(/['"’]/g,"");
        if (clean_text.includes(clean_phrase)) {
            get_sentences(twabs[i]['html'], clean_phrase, i).then(function (response) {
                if (response) {
                    hits[response[0]] = twabs[response[0]];
                    hits[response[0]]['sentences'] = response[1];
                    hits[response[0]]['amount'] = response[1].length;
                }
            })
        }
    }
    return hits;
}

async function get_sentences(html, phrase, id) {
    const sentences = [];
    let re = /<ul>(?<=<ul>)((?!<div>).)*?(?=<\/ul>)<\/ul>?|<div>(?<=<div>)((?!<ul>).)*?(?=<\/div>)<\/div>|<li>(?<=<li>)((?!<ul>).)*?(?=<\/li>)<\/li>/gi;
    let m;
    let start = 0;
    const matches = html.match(re);
    for (let i in Object.keys(matches)) {
        cleaned = decodeURIComponent(encodeURIComponent(matches[i])).toLowerCase().replace(/['"’]/g,"");
        if (cleaned.includes(phrase)) {
            sentences.push(matches[i]);
        } 
    }
    if (sentences.length != 0) {
        return [id, sentences];
    }
    return false;
}

async function onload() {
    await get_twabs();
    const total = document.getElementById("total-twabs")
    total.innerText = total.innerText.replace("{Total_Twabs}", Object.keys(entries).length)
    const recent = document.getElementById("recent")
    let id;
    let time = 0;
    for (let i in Object.keys(entries)) {
        if (time < entries[Object.keys(entries)[i]]['date']) {
            id = Object.keys(entries)[i];
            time = entries[Object.keys(entries)[i]]['date'];
        }
    }
    recent.innerHTML = recent.innerText.replace("{Recent}", "<a href='https://bungie.net" + entries[id].link + "'>" + entries[id].title + "</a>");
}

let entries;
onload();

async function load_search() {
    const keyword = document.getElementById("search");
    if (keyword.value.length <= 0) {
        return false;
    }
    const result = document.getElementById("results");
    result.innerHTML = "";
    const information = document.getElementById("info");
    information.innerHTML = "";
    window.scrollTo({top: 0, behavior: 'smooth'});
    get_hits(entries, keyword.value).then( function (response) {
        if (Object.keys(response).length <= 0) {
            return false;
        }
        const sorted = sort_twabs(response, "date");
        display_twabs(sorted, keyword, true);
    });
}

function sort_twabs(twabs, sort_value, inverse=false) {
    var temp_arr = Object.keys(twabs).map(function(key) {
        return [key, twabs[key][sort_value]];
    })
    temp_arr.sort(function(first, second) {
        return second[1] - first[1];
    });
    var sorted = [];
    for (i in temp_arr) {
        if (inverse) {
            sorted.push(temp_arr[temp_arr.length-1-i][0]);
        } else {
            sorted.push(temp_arr[i][0]);
        } 
    }
    var retur = {};
    sorted.map(function(key) {
        retur[key] = twabs[key];
    });
    return retur;
}

async function get_twabs() {
	const url = "https://raw.githubusercontent.com/BowlOfLoki/lokisdestinydata/master/twabsDict.json";
	await apiRequest(url).then(function(response) {
		entries = structuredClone(response);
	});
}

async function display_twabs(response, keyword) {
    let total = 0;
    let first_id;
    let first;
    let last_id;
    let last = 0;
    let most_id;
    let most = 0;
    let res_html = "";
    for (let i in Object.keys(response)) {
        const id = Object.keys(response)[i];
        let internal = "";
        if (response[id]['sentences'].length != 0) {
            for (let i in Object.keys(response[id].sentences)) {
                var test = response[id].sentences[i];
                var re_phrase = new RegExp(keyword.value, "ig")
                const inthtml = test.replace(re_phrase, "<b class='highlight'>" + keyword.value.toUpperCase() + "</b>");
                const parser = new DOMParser();
                const html = parser.parseFromString(inthtml, "text/html");
    
                const test2 = document.createElement("div");
                test2.append(html.body);
    
                internal += test2.innerHTML;
            }
            const temp_html = "<div class='result'><h2><a href='https://bungie.net" + response[id].link + "'>" + response[id].title + "</a> - " + response[id].amount + " Appearance(s)</h2>" + internal + "</div>";
            res_html += temp_html;
            if (!(first < response[id].date)) {
                first = response[id].date;
                first_id = id; 
            }
            if (last  < response[id].date) {
                last = response[id].date;
                last_id = id;
            }
            if (most < response[id].amount) {
                most_id = id;
                most = response[id].amount
            }
            total += response[id].amount
        }
    }
    const result = document.getElementById("results");
    result.innerHTML = res_html;
    const information = document.getElementById("info");
    information.innerHTML = "<h1>" + keyword.value + 
    "</h1><p> Unique Appearances: " + Object.keys(response).length + "<br>Total Appearances: " + total +  "</p>" + 
    "<p><b>First Appearance:</b> " + get_time(first) + "<br><a href='https://bungie.net" + response[first_id].link + "'>" + response[first_id].title + 
    "</a></p><p><b>Recent Appearance:</b> " + get_time(last) + "<br><a href='https://bungie.net" + response[last_id].link + "'>" + response[last_id].title + 
    "</a></p><p><b>Most Appearances:</b> " + most + "<br><a href='https://bungie.net" + response[most_id].link + "'>" + response[most_id].title;
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
