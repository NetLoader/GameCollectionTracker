import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.RAILWAY_DB_HOST,
    user: process.env.RAILWAY_DB_USER,
    password: process.env.RAILWAY_DB_PASSWORD,
    database: process.env.RAILWAY_DB_NAME,
    port: process.env.RAILWAY_DB_PORT,
    connectionLimit: 10
});

export default pool;