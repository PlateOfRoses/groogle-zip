var input = document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        if (!entries) {
            return false;
        }
        const keyword = document.getElementById("search");
        if (keyword.value.length > 0) {
            return false;
        }
        console.log(keyword.value);
        /* Get the twabs here ig - too tired to do now maybe probably shit code
         shitty fucking regex that took me too long to figure out gets 
         between <ul> and </ul> - maybe wanna grab <div> and </div> */
        const re = /<ul>(?<=<ul>).+?(?=<\/ul>)<\/ul>/i;
        }
    }
)


async function onload() {
    await get_twabs();
    console.log(Object.keys(entries).length);
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
    console.log(entries[id].html);
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
    console.log(url)
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
