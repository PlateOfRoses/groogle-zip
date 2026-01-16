const days_in_month = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31];
const days_in_month_leap = [31, 29, 31, 30, 31, 30, 31, 30, 31, 30, 31];
const a_month = new Date(1970, 0, 31).getTime();

async function hideStartMonths() {
    const year = document.getElementById("startyear").value;
    const date = new Date();
    const nodes = new Array();
    const end_time = endDate().getTime();
    for (let x = 1; x <= document.getElementById("startmonth").childNodes.length; x += 2) {
        const current_node = document.getElementById("startmonth").childNodes[x];
        if (document.getElementById("startmonth").childNodes[x] != null) {
            const node_time = getDate(year, current_node.value-1, ((year * 1) % 4 == 0 ? days_in_month_leap[current_node.value] : (current_node.value == "12" ? 31 : days_in_month[current_node.value-1]))+1).getTime()
            console.log(node_time + "  " + x);
            if (node_time > end_time && node_time < date.getTime() + a_month) {
                current_node.disabled = false;
            } else {
                current_node.disabled = true;
            }
        }
    }
    // if (date.getFullYear() == year) {
    //     for (let v in Object.keys(nodes)) {
    //         const x = nodes[v];
    //         console.log(x);
    //         if (x.value <= date.getMonth()+1 && (x.value >= document.getElementById("endmonth").value && document.getElementById("endyear").value != document.getElementById("startyear").value)) {
    //             x.disabled = false;
    //         } else {
    //             x.disabled = true;
    //         }
    //     }
    // } else if (year == 2016) {
    //     for (let v in Object.keys(nodes)) {
    //         const x = nodes[v];
    //         if (x.value >= 5 && (x.value >= document.getElementById("endmonth").value && document.getElementById("endyear").value != document.getElementById("startyear").value)) {
    //             x.disabled = false;
    //         } else {
    //             x.disabled = true;
    //         }
            
    //     }
    // } else {
    //     for (let v in Object.keys(nodes)) {
    //         const x = nodes[v];
    //         if (x.value >= document.getElementById("endmonth").value && document.getElementById("endyear").value != document.getElementById("startyear").value) {
    //             x.disabled = false;
    //         } else {
    //             x.disabled = true;
    //         }
    //     }
    // }
}

function startDate() {
    return getDate(document.getElementById("startyear").value, document.getElementById("startmonth").value, days_in_month[document.getElementById("startmonth").value * 1]);
}

function endDate() {
    return getDate(document.getElementById("endyear").value, document.getElementById("endmonth").value, 0);
}

function getDate(year, month, day) {
    if (year % 4 == 0 && month == 2 && day != 1) {
        return new Date(year, month, 29);
    } else {
        return new Date(year, month, day);
    }
}


async function hideEndMonths() {
    const year = document.getElementById("endyear").value;
    const date = new Date();
    const nodes = [];
    for (let x = 1; x <= document.getElementById("endmonth").childNodes.length; x += 2) {
        if (document.getElementById("endmonth").childNodes[x] != null) {
            nodes.push(document.getElementById("endmonth").childNodes[x]);
        }
    }
    if (date.getFullYear() == year) {
        for (let v in Object.keys(nodes)) {
            const x = nodes[v];
            console.log(x);
            if (x.value <= date.getMonth()+1) {
                x.disabled = false;
            } else {
                x.disabled = true;
            }

        }
    } else if (year == 2016) {
        for (let v in Object.keys(nodes)) {
            const x = nodes[v];
            if (x.value >= 5) {
                x.disabled = false;
            } else {
                x.disabled = true;
            }
            
        }
    } else {
        for (let v in Object.keys(nodes)) {
            const x = nodes[v];
            x.disabled = false;
        }
    }
}



async function updateStartYear() {
    const year = document.getElementById("startyear").value;
    hideStartMonths();
}

async function updateEndYear() {
    const year = document.getElementById("endyear").value;
    hideEndMonths();
}


hideStartMonths();
// hideEndMonths()