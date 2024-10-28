import pool from "../database/dbConnection.js";

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

export async function getDeveloperGamesByID(devID) {
    try {
        const [games] = await pool.query(`
            SELECT g.game_id, g.game_title, d.developer_id, d.developer_name, g.game_image_url
            FROM Games g
            INNER JOIN Developers d
            ON g.developer_id = d.developer_id
            WHERE g.developer_id = ?    
        `, [devID]);
        if (games.length > 0) {
            return games;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching developer's games by id from controller: ", error);
        throw error;
    }
}