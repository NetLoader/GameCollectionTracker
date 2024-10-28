import express from "express";
import { getGenres, getGenreByID, getGenreGamesByID } from "../controllers/genreController.js"
const router = express.Router();

//getGenres
// @ex: /genres?limit=5&offset=0
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const genres = await getGenres(limit, offset);
        res.json(genres);
    } catch (error) {
        res.status(500).json({message: "Error fetching genres", error});
    }
});

//getGenreeByID
// @ex: /genres/12
router.get("/:id", async (req, res) => {
    try {
        const genreID = req.params.id;
        const genres = await getGenreByID(genreID);
        if (genres) {
            res.json(genres)
        } else {
            res.status(404).json({message: "Genre not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching genre by id", error});
    }
});

//getGenreGamesByID
router.get("/:id/games", async (req, res) => {
    try {
        const genreID = req.params.id;
        const games = await getGenreGamesByID(genreID);
        if (games) {
            res.json(games);
        } else {
            res.status(404).json({message: "Genre not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching genre's games by id", error});
    }
})

export default router;