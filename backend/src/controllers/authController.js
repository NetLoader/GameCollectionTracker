import jwt from "jsonwebtoken";
import pool from "../database/dbConnection.js";
import bcrypt from "bcrypt"
import { getUserByEmail } from "./userController.js";


export async function login(email, password) {
    try {
        const user = await getUserByEmail(email);
        if (!user || !await bcrypt.compare(password, user.user_password_hash)) {
            return {success: false, message: "Invalid email or password"}
        } else {
            const accessToken = generateAccessToken(user.user_id);
            const refreshToken = generateRefreshToken(user.user_id);
            await saveRefreshToken(user.user_id, refreshToken);
            return {success: true, data: {accessToken, refreshToken, userID: user.user_id}}; 
        }
    } catch (error) {
        console.error("Error logging in from controller: ", error);
        throw error;
    }
};

export async function logout(refreshToken) {
    if (!refreshToken) {
        return {success: false, message: "No refresh token provided"}
    }
    try {
        await deleteRefreshToken(refreshToken);
        return {success: true}
    } catch (error) {
        console.error("Error logging out from controller: ", error);
        throw error;
    }
};

export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        return {status: 401, message: "No refresh token provided"}
    }
    try {
        const refreshTokenInDB = await getRefreshToken(refreshToken);
        if (refreshTokenInDB !== refreshToken) {
            return {status: 403, message: "Invalid refresh token, not in database"};
        }
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken(decode.userID);
        return {status: 200, data: {accessToken}};
    } catch (error) {
        console.error("Error refreshing access token from controller: ", error);
        throw error;
    }
};

function generateAccessToken(userID) {
    return jwt.sign({userID}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "6h"});        
};

function generateRefreshToken(userID) {
    return jwt.sign({userID}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "14d"});
};

async function getRefreshToken(refreshToken) {
    try {
        const [result] = await pool.query(`
            SELECT refresh_token FROM RefreshToken WHERE refresh_token = ?`, [refreshToken]);
        if (result.length > 0) {
            return result[0].refresh_token;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching refresh token from controller: ", error);
        throw error;
    }
};

async function saveRefreshToken(userID, refreshToken) {
    try {
        const [result] = await pool.query(`
            INSERT INTO RefreshToken (user_id, refresh_token) VALUES (?, ?)`, [userID, refreshToken]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error saving refresh token from controller: ", error);
        throw error;
    }
};

async function deleteRefreshToken(refreshToken) {
    try {
        const [result] = await pool.query(`
            DELETE FROM RefreshToken WHERE refresh_token = ?`, [refreshToken]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error deleting refresh token from controller: ", error);
        throw error;
    }
};