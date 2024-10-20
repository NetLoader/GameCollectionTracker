import express from "express";
import { getDevelopers, getDevelopersByID } from "../controllers/developerController.js";
const router = express.Router();

//getDevelopers
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const developers = await getDevelopers(limit, offset);
        res.json(developers);
    } catch (error) {
        res.status(500).json({message: "Error fetching developers", error});
    }
});

//getDevelopersByID
router.get("/", async (res, req) => {
    try {
        const devID = req.params.id;
        const developers = await getDevelopersByID(devID);
        if (developers) {
            res.json(developers);
        } else {
            res.status(404).json({message: "Developer not found"})
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching developers by ID", error});
    }
});

export default router;