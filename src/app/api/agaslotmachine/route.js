import {fetchUrl} from "fetch";

const fs = require('fs');


export async function GET(request, {searchParams}) {
    const aga = JSON.parse(fs.readFileSync('./src/app/lib/agas.json', { encoding: 'utf8', flag: 'r' }));
    const users = JSON.parse(fs.readFileSync('./src/app/lib/users.json', { encoding: 'utf8', flag: 'r' }));

    const params = await request.nextUrl.searchParams;
    const id = params.get('id');
    const user_level = params.get('ul');
    if (user_level == "everyone" && id != "1348325011") {
        if (users.includes(id)) {
            return Response.json("Your free trial of !agaslotmachine has expired, subscribe to use it again");
        }
        users.push(id);
        fs.writeFileSync('./src/app/lib/users.json', JSON.stringify(users));
        return Response.json(`You rolled: [ ${generateLootBoxSeeded(aga)} ]`);
    } else if (id == "856501738") {
        return Response.json(`lemon elisNOIDONTTHINKSO : [ ${generateLootBox(aga)} ]`);
    }
    else if (id == "1348325011") {
       return Response.json(`You rolled: [ UEWSDGFBRVTRY47E3DGY47SWDTYUSDVBTGVNCXMCVBCNXJHBVYD34GYRTUFDJWG3BVTEF78EU2QJHGRT64Y73EY82IW9JENRBGYT | UEWSDGFBRVTRY47E3DGY47SWDTYUSDVBTGVNCXMCVBCNXJHBVYD34GYRTUFDJWG3BVTEF78EU2QJHGRT64Y73EY82IW9JENRBGYT | UEWSDGFBRVTRY47E3DGY47SWDTYUSDVBTGVNCXMCVBCNXJHBVYD34GYRTUFDJWG3BVTEF78EU2QJHGRT64Y73EY82IW9JENRBGYT  ]`);
    }
    return Response.json(`You rolled: [ ${generateLootBox(aga)} ]`);
}

function generateLootBox(agas) {
    return `${agas[Math.floor(Math.random() * agas.length)]} | ${agas[Math.floor(Math.random() * agas.length)]} | ${agas[Math.floor(Math.random() * agas.length)]}`;
}

function generateLootBoxSeeded(agas) {
    const seed = Math.floor(Math.random() * agas.length);
    let second = -1;
    while (second == seed || second == -1) {
        second = Math.floor(Math.random() * agas.length);
    }
    const placement = Math.floor(Math.random() * 2.99);

    let agarray = [agas[seed], agas[seed], agas[seed]];
    agarray[placement] = agas[second];

    return `${agarray[0]} | ${agarray[1]} | ${agarray[2]}`;
}