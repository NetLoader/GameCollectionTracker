import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function getDevelopers(limit, offset) {
    try {
        const [dev] = await pool.query(`
            SELECT *
            FROM Developers
            ORDER BY developer_id
            LIMIT ? OFFSET ?`, [limit, offset]);
        return dev;
    } catch (error) {
        console.error("Error fetching developers data from controller: ", error);
        throw error;
    }
};

export async function getDevelopersByID(devID) {
    try {
        const [dev] = await pool.query(`
            SELECT * 
            FROM Developers 
            WHERE developer_id = ?`, [devID]);
        if (dev.length > 0) {
            return dev[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching developer by id from controller: ", error);
        throw error;
    }
}