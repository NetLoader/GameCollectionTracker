import express from "express";
import {dbSetup} from "./database/dbSetup.js";


const PORT = process.env.PORT;
const app = express();

app.use(express.json());

//Setup my database
dbSetup().then(() => {
    console.log("Database setup complete")
}).catch((err) => {
    console.log("Database setup failed:", err)
});



app.listen(PORT, () => console.log(`Server is running on ${PORT}`));