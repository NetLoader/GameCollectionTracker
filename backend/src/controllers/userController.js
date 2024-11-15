import pool from "../database/dbConnection.js";
import bcrypt from "bcrypt";

export async function getUsers(limit, offset) {
    try {
        const [users] = await pool.query(`
            SELECT *
            FROM Users 
            ORDER BY user_id 
            LIMIT ? OFFSET ?`, [limit, offset]);
        return users;
    } catch (error) {
        console.error("Error fetching users data from controller: ", error);
        throw error;
    }
};

export async function getUserByID(userID) {
    try {
        const [user] = await pool.query(`
            SELECT *
            FROM Users
            WHERE user_id = ?`, [userID]);
        if (user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching users by ID from controller: ", error);
        throw error;
    }
};

export async function getUserByEmail(userEmail) {
    try {
        const [user] = await pool.query(`
            SELECT *
            FROM Users
            WHERE user_email = ?`, [userEmail]);
        if (user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching users by email from controller: ", error);
        throw error;
    }
}

export async function createUser(username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await pool.query(`
            INSERT INTO Users (username, user_email, user_password_hash) VALUES (?, ?, ?)`, [username, email, hashedPassword]);
        return (user.affectedRows > 0);
    } catch (error) {
        console.error("Error creating user from controller: ", error);
        throw error;
    }
};

export async function updateUserPassword(userID, newPassword) {
    try {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const [user] = await pool.query(`
            UPDATE Users
            SET user_password_hash = ?
            WHERE user_id = ?`, [hashedNewPassword, userID]);
        return (user.affectedRows > 0);
    } catch (error) {
        console.error("Error updating user from controller: ", error);
        throw error;
    }
};

export async function deleteUser(userID) {
    try {
        const [user] = await pool.query(`
            DELETE FROM Users
            WHERE user_id = ?`, [userID]);
        return (user.affectedRows > 0);
    } catch (error) {
        console.error("Error deleting user from controller: ", error);
        throw error;
    }
};
