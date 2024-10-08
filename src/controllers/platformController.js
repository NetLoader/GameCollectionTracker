import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function getPlatforms(limit, offset) {
    try {
        const [platform] = await pool.query(`
            SELECT * 
            FROM Platforms 
            ORDER BY platform_id 
            LIMIT ? OFFSET ?`, [limit, offset]);
        return platform;
    } catch (error) {
        console.error("Error fetching platform from controller: ", error);
        throw error;
    }
};

export async function getPlatformByID(platformID) {
    try {
        const [platform] = await pool.query(`
            SELECT * 
            FROM Platforms 
            WHERE platform_id = ?`, [platformID]);
        if (platform.length > 0) {
            return platform[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching platform by id from controller: ", error);
        throw error;
    }
}