import express from "express";
import cors from "cors";
import {dbSetup} from "./database/dbSetup.js"
import { fetchGamesData, insertDataIntoDB } from "./api/IGDB_API.js"
import searchRoutes from "./routes/searchRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userCollectionRoutes from "./routes/userCollectionRoutes.js"
import authRoutes from "./routes/authRoutes.js"

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

//Setup my database
async function initDatabase() {
    try {
        await dbSetup();
        console.log("Database setup complete");
    } catch (error) {
        console.log("Database setup failed:", error);
    }
}
initDatabase();

//fetch data from IGDB and insert them into db
// Comment this block out after fetching the data so that normal user cannot access this endpoint
app.get("/api/fetchGamesFromIGDB", async (req, res) => {
    try {
        const gamesData = await fetchGamesData(); 
        await insertDataIntoDB(gamesData);
        res.json(gamesData); 
    } catch (error) {
        console.error("Error fetching games data:", error);
        res.status(500).send("Error fetching games data");
    }
});

//Routers
app.use("/api/search", searchRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/developers", developerRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userCollections", userCollectionRoutes);
app.use("/api/auth",authRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));