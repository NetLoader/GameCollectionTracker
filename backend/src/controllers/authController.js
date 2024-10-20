import jwt from "jsonwebtoken";
import pool from "../database/dbConnection.js";
import bcrypt from "bcrypt"
import { getUserByEmail } from "./userController.js";

export async function login(req, res) {
    const {user_email, user_password, user_id} = req.body
    try {
        const user = await getUserByEmail(user_email);
        if (user && await bcrypt.compare(user_password, user.user_password_hashed)) {
            const accessToken = generateAccessToken(user_id);
            const refreshToken = generateRefreshToken(user_id);
            await saveRefreshToken(user_id, refreshToken);
            res.json({accessToken, refreshToken});              // make it save in cache
        } else {
            res.status(401).json({message: "Invalid"})
        }
    } catch (error) {
        console.error("Error logging in from controller: ", error);
        throw error;
    }
};

export async function logout(req, res) {
    const {userID} = req.body;
    try {
        await deleteRefreshToken(userID);
    } catch (error) {
        console.error("Error logging out from controller: ", error);
        throw error;
    }
};

export async function refreshAccessToken(req, res) {
    const {refreshToken, userID} = req.body;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    try {
        const refreshTokenInDB = await getRefreshToken(userID);
    if (refreshTokenInDB !== refreshToken) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken({id: user.id});
        res.json({accessToken: accessToken});
    });
    } catch (error) {
        console.error("Error refreshing access token from controller: ", error);
        throw error;
    }
};

// the user parameter here is the data for the JWT payload (put id, username, email, role (admin or user), and expire date)
function generateAccessToken(user) {
    return accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20m"});
};

function generateRefreshToken(user) {
    return refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "14d"});
};

async function getRefreshToken(userID) {
    try {
        const [result] = await pool.query(`
            SELECT refresh_token FROM RefreshToken WHERE user_id = ?`, [userID]);
        if (result.length > 0) {
            return result[0];
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

async function deleteRefreshToken(userID) {
    try {
        const [result] = await pool.query(`
            DELETE FROM RefreshToken WHERE user_id = ?`, [userID]);
        return (result.affectedRows > 0);
    } catch (error) {
        console.error("Error deleting refresh token from controller: ", error);
        throw error;
    }
};