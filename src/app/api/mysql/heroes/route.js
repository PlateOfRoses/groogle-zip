const fs = require('fs');

import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

let connectionParams = {
    host: process.env.HOST_DEV,
    user: process.env.USER_DEV,
    port: 3306,
    password: process.env.SQL_PASSWORD,
    database: process.env.DATABASE_DEV,
    ssl: {
        ca : fs.readFileSync('./server-ca.pem'),
        key : fs.readFileSync('./client-key.pem'),
        cert : fs.readFileSync('./client-cert.pem'),
    }
}

export async function GET(request) {
    if (request.headers.get('access-key') !== process.env.ACCESS_KEY) {
        return NextResponse.json({status: 403});
    }
    try {
        const connection = await mysql.createConnection(connectionParams);

        let get_exp_query = '';

        get_exp_query = 'SELECT * FROM heroes';

        let values = []

        const [results] = await connection.execute(get_exp_query, values);
        connection.end();
        const alias_dict = {}
        for (let entry in results) {
            alias_dict[results[entry].alias] = results[entry].hero_name;
        }
        return NextResponse.json(alias_dict);

    } catch (error) {
        console.log('ERROR: API - ', error.message);

        const response = {
            error: error.message,
            returnedStatus: 200
        }

        return NextResponse.json(response, { status: 200 })
    }
}

export async function POST(request) {
    if (process.env.ACCESS_KEY !== request.headers.get('access-key')) {
        return new Response("No Authorisation", { status: 401 });
    }
    try {
        const req = await request.json();
        const hero = req.hero;
        const alias = req.alias;
        console.log(hero);
        
        const connection = await mysql.createConnection(connectionParams);

        let get_exp_query = `INSERT INTO heroes VALUE ("${hero}", "${alias}");`;

        let values = []

        const [results] = await connection.execute(get_exp_query, values);
        connection.end();

        return NextResponse.json(results);
    } catch (error) {
        console.log('ERROR: API - ', error.message);

        const response = {
            error: error.message,
            returnedStatus: 200
        }

        return NextResponse.json(response, { status: 200 });
    }
}