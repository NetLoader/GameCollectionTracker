import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function getGameByName(gameName) {
    try {
        const [games] = await pool.query(`
            SELECT * 
            FROM Games 
            WHERE game_title LIKE ?`, [`%${gameName}%`]);
        if (games.length > 0) {
            return games;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching game by name from controller: ", error);
        throw error;
    }
};
