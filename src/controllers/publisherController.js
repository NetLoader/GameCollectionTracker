import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

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