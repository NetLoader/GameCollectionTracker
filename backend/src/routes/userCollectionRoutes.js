import express from "express";
import { addGameToCollection, deleteGameFromCollection, getUserCollection, updateGameStatus } from "../controllers/userCollectionController.js";
import { authenticateToken } from "../middleware/authTokenMiddleware.js";

const router = express.Router();

// addGameToCollection
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {userID, gameID, status} = req.body;
        if (userID != req.user) {
            return res.status(403).json({message: "You are not authorized to update this user's data"});
        }

        const result = await addGameToCollection(userID, gameID, status);
        if (result.success) {
            res.status(200).json({message: result.message});
        } else {
            res.status(400).json({message: result.message});
        }
    } catch (error) {
        res.status(500).json({message: "Error adding game to user's collection", error});
    }
});

// deleteGameFromCollection
router.delete("/", authenticateToken, async (req, res) => {
    try {
        const {userID, gameID} = req.body;
        if (userID != req.user) {
            return res.status(403).json({message: "You are not authorized to delete this user's data"});
        }

        const result = await deleteGameFromCollection(userID, gameID);
        if (result) {
            res.status(200).json({message: "Game deleted from collection"});
        } else {
            res.status(404).json({message: "userId and gameID not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting game from user's collection", error});
    }
});

// updateGameStatus
router.put("/", authenticateToken, async (req, res) => {
    try {
        const {userID, gameID, status} = req.body;
        if (userID != req.user) {
            return res.status(403).json({message: "You are not authorized to update this user's data"});
        }

        const result = await updateGameStatus(userID, gameID, status);
        if (result) {
            res.status(200).json({message: "Game's status updated"});
        } else {
            res.status(404).json({message: "userID and gameID not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error updating game status", error});
    }
});

// getUserCollection
router.get("/", authenticateToken, async (req, res) => {
    try {
        const {userID} = req.body;
        const result = await getUserCollection(userID);
        if (userID != req.user) {
            return res.status(403).json({message: "You are not authorized to access this user's data"});
        }

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({message: "user_id not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching user's collection", error});
    }
});

export default router;