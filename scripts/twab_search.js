var input = document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        if (!entries) {
            return false;
        }
        const keyword = document.getElementById("search");
        if (keyword.value.length <= 0) {
            return false;
        }
        const result = document.getElementById("results");
        result.innerHTML = "";
        const information = document.getElementById("info");
        information.innerHTML = "";
        /*
         Get the twabs here ig - too tired to do now maybe probably shit code
         shitty fucking regex that took me too long to figure out gets 
         between <ul> and </ul> or <div> and </div> whichever is shorter
        */
        get_hits(entries, keyword.value).then( function (response) {
            if (Object.keys(response).length <= 0) {
                return false;
            }
            console.log(response);
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
                for (let i in Object.keys(response[id])) {
                    var test = response[id][i];
                    var re_phrase = new RegExp(keyword.value, "ig")
                    internal += test.replace(re_phrase, "<b class='highlight'>" + keyword.value.toUpperCase() + "</b>");
                }
                const temp_html = "<div><h2><a href='https://bungie.net" + entries[id].link + "'>" + entries[id].title + "</a> - " + response[id].length + " Appearance(s)</h2>" + internal + "</div>";
                res_html += temp_html;
                if (!(first < entries[id].date)) {
                    first = entries[id].date;
                    first_id = id;
                }
                if (last  < entries[id].date) {
                    last = entries[id].date;
                    last_id = id;
                }
                if (most < response[id].length) {
                    most_id = id;
                    most = response[id].length
                }
                total += response[id].length
            }
            const result = document.getElementById("results");
            result.innerHTML = res_html;
            const information = document.getElementById("info");
            information.innerHTML = "<h1>" + keyword.value + 
            "</h1><p> Unique Appearances: " + Object.keys(response).length + "<br>Total Appearances: " + total +  "</p>" + 
            "<p><b>First Appearance:</b> " + get_time(first) + "<br><a href='https://bungie.net" + entries[first_id].link + "'>" + entries[first_id].title + 
            "</a></p><p><b>Recent Appearance:</b> " + get_time(last) + "<br><a href='https://bungie.net" + entries[last_id].link + "'>" + entries[last_id].title + 
            "</a></p><p><b>Most Appearances:</b> " + most + "<br><a href='https://bungie.net" + entries[most_id].link + "'>" + entries[most_id].title;
        });
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
                hits[response[0]] = response[1];
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
    return [id, sentences];

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




async function get_twabs() {
	const url = "https://raw.githubusercontent.com/BowlOfLoki/lokisdestinydata/master/twabsDict.json";
	await apiRequest(url).then(function(response) {
		entries = structuredClone(response);
	});
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
