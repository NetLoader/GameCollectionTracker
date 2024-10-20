import pool from "../database/dbConnection.js";

export async function getGenres(limit, offset) {
    try {
        const [genres] = await pool.query(`
            SELECT * 
            FROM Genres 
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
            FROM Genres 
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