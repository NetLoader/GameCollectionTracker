import pool from "../database/dbConnection.js";

export async function addGameToCollection(userID, gameID, status) {
    try {
        const [checkCollection] = await pool.query(`
            SELECT * 
            FROM usercollection 
            WHERE user_id = ? AND game_id = ?
        `, [userID, gameID]);
        if (checkCollection.length > 0) {
            return { success: false, message: "Game already in user's collection"};
        }
        const [result] = await pool.query(`INSERT INTO usercollection (user_id, game_id, status) VALUES (?, ?, ?)`, [userID, gameID, status]);
        if (result.affectedRows > 0) {
            return {success: true, message: "Game added to collection"};
        } else {
            return {success: false, message: "Failed to add game to collection"};
        }
    } catch (error) {
        console.error("Error adding game to collection from controller: ", error);
        throw error;
    }
};

export async function deleteGameFromCollection(userID, gameID) {
    try {
        const [result] = await pool.query(`
            DELETE 
            FROM usercollection 
            WHERE user_id = ? AND game_id = ?
        `, [userID, gameID]);
        return (result.affectedRows > 0); 
    } catch (error) {
        console.error("Error deleting game from collection from controller: ", error);
        throw error;
    }
};

export async function updateGameStatus (userID, gameID, status) {
    try {
        const [result] = await pool.query(`
            UPDATE usercollection
            SET status = ?
            WHERE user_id = ? AND game_id = ?
        `, [status, userID, gameID]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error updating game status from controller: ", error);
        throw error;
    }
};

export async function checkUserCollection (userID, gameID) {
    try {
        const [result] = await pool.query(`
            SELECT * 
            FROM usercollection 
            WHERE user_id = ? AND game_id = ?
        `, [userID, gameID]);
        return (result.length > 0);
    } catch (error) {
        console.error("Error checking user's collection from controller: ", error);
        throw error;
    }
}

export async function getUserCollection(userID) {
    try {
        const [result] = await pool.query(`
            SELECT uc.user_id, uc.game_id, uc.status, g.game_title, g.game_image_url
            FROM usercollection uc
            JOIN games g ON uc.game_id = g.game_id
            WHERE uc.user_id = ?
        `, [userID]);
        return result;
    } catch (error) {
        console.error("Error fetching user's collection from controller: ", error);
        throw error;
    }
};

export async function getUserCollectionByStatus(userID, status) {
    try {
        const [result] = await pool.query(`
            SELECT uc.user_id, uc.game_id, uc.status, g.game_title, g.game_image_url
            FROM usercollection uc
            JOIN games g ON uc.game_id = g.game_id
            WHERE uc.user_id = ? AND uc.status = ?
        `, [userID, status]);
        return result;
    } catch (error) {
        console.error("Error fetching user's collection by status from controller: ", error);
        throw error;
    }
}