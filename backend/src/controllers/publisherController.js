import pool from "../database/dbConnection.js";

export async function getPublishers(limit, offset) {
    try {
        const [publishers] = await pool.query(`
            SELECT * 
            FROM Publishers 
            ORDER BY publisher_id 
            LIMIT ? OFFSET ?`, [limit, offset]);
        return publishers;
    } catch (error) {
        console.error("Error fetching publishers from controller: ", error);
        throw error;
    }
};

export async function getPublisherByID(publisherID) {
    try {
        const [publishers] = await pool.query(`
            SELECT * 
            FROM Publishers 
            WHERE publisher_id = ?`, [publisherID]);
        if (publishers.length > 0) {
            return publishers[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching publisher by id from controller: ", error);
        throw error;
    }
}

export async function getPublisherGamesByID(publisherID) {
    try {
        const [games] = await pool.query(`
            SELECT g.game_id, g.game_title, p.publisher_id, p.publisher_name, g.game_image_url
            FROM Games g
            INNER JOIN Publishers p
            ON g.publisher_id = p.publisher_id
            WHERE g.publisher_id = ?    
        `, [publisherID]);
        if (games.length > 0) {
            return games;
        } else {
            return [];
        }
    } catch (error) {
        
    }
}