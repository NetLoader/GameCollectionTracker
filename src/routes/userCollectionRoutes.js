import express from "express";
import { addGameToCollection, deleteGameFromCollection, getUserCollection, updateGameStatus } from "../controllers/userCollectionController.js";
const router = express.Router();

// @ex: /userCollections
router.post("/", async (req, res) => {
    try {
        const result = await addGameToCollection(req.body);
        if (result) {
            res.status(200).json({message: "Game added to collection"});
        } else {
            res.status(404).json({message: "user_id and game_id not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error adding game to user's collection", error});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await deleteGameFromCollection(req.params.id);
        if (result) {
            res.status(200).json({message: "Game deleted from collection"});
        } else {
            res.status(404).json({message: "user_collection_id not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting game from user's collection", error});
    }
});

router.put("/:id", async (req, res) => {
    try {
        const status = req.body.status;
        const result = await updateGameStatus(req.params.id, status);
        if (result) {
            res.status(200).json({message: "Game's status updated"});
        } else {
            res.status(404).json({message: "user_collection_id not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error updating game status", error});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await getUserCollection(req.params.id);
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