import express from "express";
import { getPlatforms, getPlatformByID, getPlatformGameByID } from "../controllers/platformController.js";
const router = express.Router();

//getPlatforms
// @ex: /platforms?limit=5&offset=0
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const platforms = await getPlatforms(limit, offset);
        res.json(platforms);
    } catch (error) {
        res.status(500).json({message: "Error fetching platforms", error});
    }
});

//getPlatformByID
// @ex: /platforms/12
router.get("/:id", async (req, res) => {
    try {
        const platformID = req.params.id;
        const platform = await getPlatformByID(platformID);
        if (platform) {
            res.json(platform)
        } else {
            res.status(404).json({message: "Platform not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching platform by id", error});
    }
});

router.get("/:id/games", async (req, res) => {
    try {
        const platformID = req.params.id;
        const games = await getPlatformGameByID(platformID);
        if (games) {
            res.json(games)
        } else {
            res.status(404).json({message: "Platform not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching platform game", error});
    }
})

export default router;