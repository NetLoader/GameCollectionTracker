import express from "express";
import { getGameByName } from "../controllers/searchController.js"

const router = express.Router();

//getGameByName
// @ex: /search?name=spacemarine
router.get("/", async (req, res) => {
    try {
        const gameName = req.query.name;
        const games = await getGameByName(gameName);
        if (games) {
            res.json(games)
        } else {
            res.status(404).json({message: "Game not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching games by name", error});
    }
});

export default router;