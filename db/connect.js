const {Client} = require('pg')
const config = {
    host:process.env.HOST,
    user: process.env.POSTGRES_USER,
    port: process.env.POSTGRES_PORT,
    password: process.env.POSTGRES_PASSWORD,
    database: "bbm"
}

const client = new Client(config);
module.exports = client;