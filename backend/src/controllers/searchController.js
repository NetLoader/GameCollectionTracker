import pool from "../database/dbConnection.js";

export async function getGamesByName(gameName) {
    try {
        const [games] = await pool.query(`
            SELECT game_id, game_title
            FROM Games 
            WHERE game_title LIKE ? LIMIT 5`, [`%${gameName}%`]);
        if (games.length > 0) {
            return games;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching game by name from controller: ", error);
        throw error;
    }
};

export async function getDevelopersByName(devName) {
    try {
        const [dev] = await pool.query(`
            SELECT developer_id, developer_name
            FROM Developers 
            WHERE developer_name LIKE ? LIMIT 5`, [`%${devName}%`]);
        if (dev.length > 0) {
            return dev;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching developers by name from controller: ", error);
        throw error;
    }
};

export async function getPublishersByName(publisherName) {
    try {
        const [pub] = await pool.query(`
            SELECT publisher_id, publisher_name
            FROM Publishers 
            WHERE publisher_name LIKE ? LIMIT 5`, [`%${publisherName}%`]);
        if (pub.length > 0) {
            return pub;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching publishers by name from controller: ", error);
        throw error;
    }
};

export async function getGameByGenre(genreName) {
    try {
        const [result] = await pool.query(`
            SELECT g.game_id, g.game_title, gr.genre_id, gr.genre_name
            FROM Games g
            INNER JOIN GameGenre gg ON g.game_id = gg.game_id
            INNER JOIN Genres gr ON gg.genre_id = gr.genre_id
            WHERE gr.genre_name LIKE ?`, [`%${genreName}%`]);
        return result;
    } catch (error) {
        console.error("Error fetching game by genre from controller: ", error);
        throw error;
    }
}

export async function getGameByPlatform(platformName) {
    try {
        const [result] = await pool.query(`
            SELECT g.game_id, g.game_title, p.platform_id, p.platform_name
            FROM Games g
            INNER JOIN GamePlatform gp ON g.game_id = gp.game_id
            INNER JOIN Platforms p ON gp.platform_id = p.platform_id
            WHERE p.platform_name LIKE ?`, [`%${platformName}%`]);
        return result;
    } catch (error) {
        console.error("Error fetching game by platform from controller: ", error);
        throw error;
    }
}

export async function getGenreByName(genreName) {
    try {
        const [result] = await pool.query(`
            SELECT *
            FROM Genres
            WHERE genre_name LIKE ? LIMIT 5`, [`%${genreName}%`]);
        return result;
    } catch (error) {
        console.error("Error fetching game by genre from controller: ", error);
        throw error;
    }
}

export async function getPlatformByName(platformName) {
    try {
        const [result] = await pool.query(`
            SELECT *
            FROM Platforms
            WHERE platform_name LIKE ? LIMIT 5`, [`%${platformName}%`]);
        return result;
    } catch (error) {
        console.error("Error fetching game by platform from controller: ", error);
        throw error;
    }
}