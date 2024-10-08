import express from "express";
import { getGamesByName, getDevelopersByName, getPublishersByName, getGenresByName, getPlatformsByName } from "../controllers/searchController.js"

const router = express.Router();

//getGameByName
// @ex: /search?game=Elden Ring
router.get("/", async (req, res) => {
    try {
        const gameName = req.query.game;
        const games = await getGamesByName(gameName);
        if (games) {
            res.json(games)
        } else {
            res.status(404).json({message: "Game not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching game by name", error});
    }
});

//getDevelopersByName
// @ex: /search?developer=From Software
router.get("/", async (req, res) => {
    try {
        const devName = req.query.developer;
        const developer = await getDevelopersByName(devName);
        if (developer) {
            res.json(developer)
        } else {
            res.status(404).json({message: "Developer not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching developer by name", error});
    }
});

//getPublishersByName
// @ex: /search?publisher=Square Enix
router.get("/", async (req, res) => {
    try {
        const pubName = req.query.publisher;
        const pub = await getPublishersByName(pubName);
        if (pub) {
            res.json(pub)
        } else {
            res.status(404).json({message: "Publisher not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching publisher by name", error});
    }
});

//getGenresByName
// @ex: /search?genre=RPG
router.get("/", async (req, res) => {
    try {
        const genreName = req.query.genre;
        const genre = await getGenresByName(genreName);
        if (genre) {
            res.json(genre)
        } else {
            res.status(404).json({message: "Genre not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching genre by name", error});
    }
});

//getPlatformsByName
// @ex: /search?platform=Playstation
router.get("/", async (req, res) => {
    try {
        const platformName = req.query.platform;
        const platform = await getPlatformsByName(platformName);
        if (platform) {
            res.json(platform)
        } else {
            res.status(404).json({message: "Platform not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching platform by name", error});
    }
});

export default router;