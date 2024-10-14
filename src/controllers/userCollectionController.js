import pool from "../database/dbConnection.js";

export async function addGameToCollection(data) {
    try {
        const {userID, gameID, status} = data;

        const [checkCollection] = await pool.query(`
            SELECT * 
            FROM UserCollection 
            WHERE user_id = ? AND game_id = ?`, [userID, gameID]);
        if (checkCollection.length > 0) {
            return { messsage: "Game already in user's collection"}
        }

        const [result] = await pool.query(`
            INSERT INTO UserCollection (user_id, game_id, status) VALUES (?, ?, ?)`, [userID, gameID, status]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error adding game to collection from controller: ", error);
        throw error;
    }
};

export async function deleteGameFromCollection(userCollectionID) {
    try {
        const [result] = await pool.query(`DELETE FROM UserCollection WHERE user_collection_id = ?`, [userCollectionID]);
        return (result.affectedRows > 0); 
    } catch (error) {
        console.error("Error deleting game from collection from controller: ", error);
        throw error;
    }
};

export async function updateGameStatus (userCollectionID, status) {
    try {
        const [result] = await pool.query(`
            UPDATE UserCollection
            SET status = ?
            WHERE user_collection_id = ?`, [status, userCollectionID]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error updating game status from controller: ", error);
        throw error;
    }
};

export async function getUserCollection(userID) {
    try {
        const [result] = await pool.query(`
            SELECT uc.user_id, g.game_title, uc.status
            FROM UserCollection uc
            JOIN Games g ON uc.game_id = g.game_id
            WHERE uc.user_id = ?`, [userID]);
        return result;
    } catch (error) {
        console.error("Error fetching user's collection from controller: ", error);
        throw error;
    }
};