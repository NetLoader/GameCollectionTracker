import express from "express";
import {getGameByID, getGameGenresByID, getGamePlatformsByID, getGames} from "../controllers/gameController.js"
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

//getGameGenresByID
// @ex: /games/12/genres
router.get("/:id/genres", async (req, res) => {
    try {
        const gameID = req.params.id;
        const genres = await getGameGenresByID(gameID)
        if (genres) {
            res.json(genres)
        } else {
            res.status(404).json({message: "Genres not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching game genres by id", error});
    }
})

//getGamePlatformsByID
// @ex: /games/12/platforms
router.get("/:id/platforms", async (req, res) => {
    try {
        const gameID = req.params.id;
        const platforms = await getGamePlatformsByID(gameID);
        if (platforms) {
            res.json(platforms)
        } else {
            res.status(404).json({message: "Platforms not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching game platforms by id", error});
    }
})


export default router;