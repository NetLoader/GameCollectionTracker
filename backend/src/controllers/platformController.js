import pool from "../database/dbConnection.js";

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

export async function getPlatformGameByID(platformID) {
    try {
        const [games] = await pool.query(`
            SELECT g.game_id, g.game_title, g.game_image_url, p.platform_id, p.platform_name
            FROM Platforms p
            INNER JOIN GamePlatform gp
            ON p.platform_id = gp.platform_id
            INNER JOIN Games g
            ON gp.game_id = g.game_id
            WHERE p.platform_id = ?   
        `, [platformID]);
        if (games.length > 0) {
            return games;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching platform game by id from controller: ", error);
        throw error;
    }
}