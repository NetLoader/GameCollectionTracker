import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//NOTE: use this to display on homepage (~10 games at a time, when the user click "show more" fetch the next 10)
export async function getGames(limit, offset) {
    try {
        const [games] = await pool.query(`
            SELECT * 
            FROM Games 
            ORDER BY game_id 
            LIMIT ? OFFSET ?`, [limit, offset]);
        return games;
    } catch (error) {
        console.error("Error fetching games data from controller: ", error);
        throw error;
    }
};

export async function getGameByID(gameID) {
    try {
        const [games] = await pool.query(`
            SELECT * 
            FROM Games 
            WHERE game_id = ?`, [gameID]);
        if (games.length > 0) {
            return games[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching game by id from controller: ", error);
        throw error;
    }
}


export async function deleteGame(gameID) {
    try {
        const [result] = await pool.query(`
            DELETE FROM Games 
            WHERE game_id = ?`, [gameID]);
        return result;
    } catch (error) {
        console.error("Error deleting game from controller: ", error);
        throw error;
    }
}

