import express from "express";
import {deleteGame, getGameByID, getGames} from "../controllers/gameController.js"
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

//deleteGame
// @note: gotta update my dbSetup.js to include "ON DELETE CASCADE" for this to work
// @note: also make sure normal user cannot access this
router.delete("/:id", async (req, res) => {
    try {
        const gameID = req.params.id;
        const deletedGame = await deleteGame(gameID);
        if (deletedGame) {
            res.json({message: "Game deleted"})
        } else {
            res.status(404).json({message: "Game not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error deleting games by id", error});
    }
});


export default router;