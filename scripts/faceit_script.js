


async function seasonselect(e) {
    document.getElementsByClassName("selected")[0].classList.remove("selected");
    e.classList.add("selected")
}

function time_to_formatted_string(date) {
    options = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timeZoneName: "short"
    }
    offset = date.getTimezoneOffset()/-60
    return `<abbr title="UTC${(offset<0?"":"+")}${offset}">${(new Intl.DateTimeFormat(undefined, options).format(date)).replace(", ", " - ")}</abbr>`
}


async function onload() {
}

async function get_povs() {
	const url = "https://raw.githubusercontent.com/PlateOfSuki/OWCSPlayerPOVS/refs/heads/main/data.json";
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

console.log(time_to_formatted_string(new Date()))
onload();
