import express from "express";
import { getPublishers, getPublisherByID, getPublisherGamesByID } from "../controllers/publisherController.js";
const router = express.Router();

//getPublishers
// @ex: /publishers?limit=5&offset=0
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const publishers = await getPublishers(limit, offset);
        res.json(publishers);
    } catch (error) {
        res.status(500).json({message: "Error fetching publishers", error});
    }
});

//getPublisherByID
// @ex: /publishers/12
router.get("/:id", async (req, res) => {
    try {
        const publisherID = req.params.id;
        const publishers = await getPublisherByID(publisherID);
        if (publishers) {
            res.json(publishers)
        } else {
            res.status(404).json({message: "Publisher not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching publisher by id", error});
    }
});

//getPublisherGamesByID
router.get("/:id/games", async (req, res) => {
    try {
        const publisherID = req.params.id;
        const games = await getPublisherGamesByID(publisherID);
        if (games) {
            res.json(games)
        } else {
            res.status(404).json({message: "Publisher not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching publisher games by id", error});
    }
})

export default router;