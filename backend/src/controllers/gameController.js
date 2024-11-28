import pool from "../database/dbConnection.js";

//NOTE: use this to display on homepage (~10 games at a time, when the user click "show more" fetch the next 10)
export async function getGames(limit, offset) {
    try {
        const [games] = await pool.query(`
            SELECT * 
            FROM games 
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
            FROM games 
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

export async function getGameGenresByID(gameID) {
    try {
        const [genres] = await pool.query(`
            SELECT g.game_id, g.game_title, gr.genre_id, gr.genre_name
            FROM gamegenre gg
            INNER JOIN games g 
            ON gg.game_id = g.game_id
            INNER JOIN genres gr 
            ON gg.genre_id = gr.genre_id
            WHERE g.game_id = ?
        `, [gameID])
        if (genres.length > 0) {
            return genres;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching game genres from controller: ", error);
        throw error;
    }
}

export async function getGamePlatformsByID(gameID) {
    try {
        const [platforms] = await pool.query(`
            SELECT g.game_id, g.game_title, p.platform_id, p.platform_name
            FROM gameplatform gp
            INNER JOIN games g
            ON gp.game_id = g.game_id
            INNER JOIN platforms p
            ON gp.platform_id = p.platform_id
            WHERE g.game_id = ?   
        `, [gameID]);
        if (platforms.length > 0) {
            return platforms;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching game platforms from controller: ", error);
        throw error;
    }
}

export async function getGameScreenshotsByID(gameID) {
    try {
        const [screenshots] = await pool.query(`
            SELECT game_screenshots_url
            FROM gamescreenshots
            WHERE game_id = ?    
        `, [gameID])
        if (screenshots.length > 0) {
            return screenshots;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching game screenshots from controller: ", error);
        throw error;
    }
}