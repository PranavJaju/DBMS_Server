const {Client} = require('pg')
const config = {
    host:process.env.HOST,
    user:process.env.USER,
    port: 5432,
    password: process.env.PASSWORD,
    database: "verceldb",
    ssl:{
        rejectUnauthorized: false,
    }
}

const client = new Client(config);
module.exports = client;