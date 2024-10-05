import express from "express";
import {dbSetup} from "./database/dbSetup.js";
import { fetchGamesData, insertDataIntoDB } from "./api/IGDB_API.js";
import gameRoutes from "./routes/gameRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";


const PORT = process.env.PORT;
const app = express();

app.use(express.json());

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
app.use("/games", gameRoutes);
app.use("/search", searchRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));