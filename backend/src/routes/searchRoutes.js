import express from "express";
import { getGamesByName, getDevelopersByName, getPublishersByName, getGenreByName, getPlatformByName } from "../controllers/searchController.js"

const router = express.Router();


// @ex: /search?type=game&name=elden
router.get("/", async (req, res) => {
    try {
        const contentType = req.query.type;
        const contentName = req.query.name;
        let result;

        if (contentType == "game") {
            result = await getGamesByName(contentName);
            res.status(200).json(result);
        } else if (contentType == "developer") {
            result = await getDevelopersByName(contentName);
            res.status(200).json(result);
        } else if (contentType == "publisher") {
            result = await getPublishersByName(contentName);
            res.status(200).json(result);
        } else if (contentType == "genre") {
            result = await getGenreByName(contentName);
            res.status(200).json(result);
        } else if (contentType == "platform"){
            result = await getPlatformByName(contentName);
            res.status(200).json(result);
        } else {
            res.status(400).json([{message: "Please enter a valid content type and content name"}])
        }
    } catch (error) {
        res.status(500).json({message: "Error searching", error});
    }
});

export default router;