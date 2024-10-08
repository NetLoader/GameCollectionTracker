import express from "express";
import {getGameByID, getGames} from "../controllers/gameController.js"
const router = express.Router();

//getGames
// @ex: /games?limit=5&offset=0
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const games = await getGames(limit, offset);
        res.json(games);
    } catch (error) {
        res.status(500).json({message: "Error fetching games", error});
    }
});

//getGameByID
// @ex: /games/12
router.get("/:id", async (req, res) => {
    try {
        const gameID = req.params.id;
        const games = await getGameByID(gameID);
        if (games) {
            res.json(games)
        } else {
            res.status(404).json({message: "Game not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching games by id", error});
    }
});



export default router;