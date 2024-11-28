import pool from "../database/dbConnection.js";

export async function getGenres(limit, offset) {
    try {
        const [genres] = await pool.query(`
            SELECT * 
            FROM genres 
            ORDER BY genre_id 
            LIMIT ? OFFSET ?`, [limit, offset]);
        return genres;
    } catch (error) {
        console.error("Error fetching genres from controller: ", error);
        throw error;
    }
};

export async function getGenreByID(genreID) {
    try {
        const [genres] = await pool.query(`
            SELECT * 
            FROM genres 
            WHERE genre_id = ?`, [genreID]);
        if (genres.length > 0) {
            return genres[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching genre by id from controller: ", error);
        throw error;
    }
}

export async function getGenreGamesByID(genreID) {
    try {
        const [games] = await pool.query(`
            SELECT g.game_id, g.game_title, gr.genre_id, gr.genre_name, g.game_image_url
            FROM games g
            INNER JOIN gamegenre gg ON g.game_id = gg.game_id
            INNER JOIN genres gr ON gg.genre_id = gr.genre_id
            WHERE gr.genre_id = ?
        `, [genreID])
        if (games.length > 0) {
            return games;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching genre's games by id from controller: ", error);
        throw error;
    }
}