import express from "express";
import {dbSetup} from "./database/dbSetup.js";
import { fetchGamesData, insertDataIntoDB } from "./api/IGDB_API.js";


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


//Testing 
app.get("/games", async (req, res) => {
    try {
        const gamesData = await fetchGamesData(); 
        await insertDataIntoDB(gamesData);
        res.json(gamesData); 
    } catch (error) {
        console.error("Error fetching games data:", error);
        res.status(500).send("Error fetching games data");
    }
});


app.listen(PORT, () => console.log(`Server is running on ${PORT}`));