import express from 'express';
import { login, logout, refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await login(email, password);
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(401).json({message: result.message});
        }
    } catch (error) {
        res.status(500).json({message: "Error logging in", error});
    }
});

router.post("/logout", async (req, res) => {
    const {refreshToken} = req.body;
    try {
        const result = await logout(refreshToken);
        if (result.success) {
            res.status(204);
        } else {
            res.status(401).json({message: result.message});
        }
    } catch (error) {
        res.status(500).json({message: "Error logging out", error});
    }
});

router.post("/refreshToken", async (req, res) => {
    const {refreshToken} = req.body;
    try {
        const result = await refreshAccessToken(refreshToken);
        if (result.status === 200) {
            res.status(200).json(result.data)
        } else {
            res.status(result.status).json({message: result.message});
        }
    } catch (error) {
        res.status(500).json({message: "Error refreshing token", error});
    }
});

export default router;