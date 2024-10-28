import axios from "axios";
import pool from "../database/dbConnection.js";

export async function getAccessToken() {
    const response = await axios.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
            grant_type: "client_credentials",
        },
    });
    return response.data.access_token;
}

export async function fetchGamesData() {
    const accessToken = await getAccessToken();
    const response = await axios.post(
        "https://api.igdb.com/v4/games",
        `fields name, summary, storyline, first_release_date, genres.name, platforms.name, cover.image_id, screenshots.image_id, rating, aggregated_rating, hypes, 
        involved_companies.company.name, involved_companies.publisher, involved_companies.developer;
        sort hypes desc;
        where aggregated_rating >= 90 
            & category = 0
            & first_release_date >= 1262322000
            & platforms != (34, 39)
            & platforms != null
            & involved_companies != null
            & summary != null
            & release_dates != null
            & genres != null;
        limit 200;`,
        {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            },
        }
    );
    return response.data;
}

export async function insertDataIntoDB(gamesData) {
    for (const game of gamesData) {
        let developerID = null;
        let publisherID = null;
        let gameID = null;
        let platformID = null;
        let genreID = null;

        //INSERT INTO Developers
        const developer = game.involved_companies.find(company => company.developer);
        if (developer) {
            const [developerData] = await pool.query(
                `SELECT developer_id 
                FROM Developers
                WHERE developer_name =?`, [developer.company.name]
            );
            if (developerData.length > 0) {
                developerID = developerData[0].developer_id;
            } else {
                const [developerResult] = await pool.query(
                    `INSERT INTO Developers (developer_name) VALUES (?)`, [developer.company.name]
                );
                developerID = developerResult.insertId;
            }
        }

        //INSERT INTO Publishers
        const publisher = game.involved_companies.find(company => company.publisher);
        if (publisher) {
            const [publisherData] = await pool.query(
                `SELECT publisher_id 
                FROM Publishers
                WHERE publisher_name =?`, [publisher.company.name]
            );
            if (publisherData.length > 0) {         
                publisherID = publisherData[0].publisher_id;
            } else {
                const [publisherResult] = await pool.query(
                    `INSERT INTO Publishers (publisher_name) VALUES (?)`, [publisher.company.name]
                );
                publisherID = publisherResult.insertId;
            }
        }

        //INSERT INTO Games
        const [gameData] = await pool.query(
            `INSERT INTO Games (developer_id, publisher_id, game_title, game_description, game_story, game_release_date, game_image_url)
            VALUES (?,?,?,?,?,?,?)`,
            [
                developerID,
                publisherID,
                game.name,
                game.summary,
                game.storyline,
                new Date(game.first_release_date * 1000),
                game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg` : null
            ] 
        ); 
        gameID = gameData.insertId;

        //INSERT INTO GameScreenshots
        for (const screenshot of game.screenshots) {
            const screenshotURL = `https://images.igdb.com/igdb/image/upload/t_cover_big/${screenshot.image_id}.jpg`
            await pool.query(`
                INSERT INTO GameScreenshots (game_id, game_screenshots_url) VALUES (?, ?)
            `, [gameID, screenshotURL]);
        }

        //INSERT INTO Platforms
        for (const platform of game.platforms) {
            const [platformData] = await pool.query(
                `SELECT platform_id
                FROM Platforms
                WHERE platform_name =?`, [platform.name]
            );
            if (platformData.length > 0) {     
                platformID = platformData[0].platform_id;    
            } else {
                const [platformResult] = await pool.query(
                    `INSERT INTO Platforms (platform_name) VALUE (?)`, [platform.name]
                );
                platformID = platformResult.insertId;
            }
        }

        //INSERT INTO Genres
        for (const genre of game.genres) {
            const [genreData] = await pool.query(
                `SELECT genre_id
                FROM Genres
                WHERE genre_name =?`, [genre.name]
            );
            if (genreData.length > 0) {          
                genreID = genreData[0].genre_id;    
            } else {
                const [genreResult] = await pool.query(
                    `INSERT INTO Genres (genre_name) VALUE (?)`, [genre.name]
                );
                genreID = genreResult.insertId;
            }
        }

        //INSERT INTO GameGenre
        for (const genre of game.genres) {
            const [genreData] = await pool.query(`
                SELECT genre_id
                FROM Genres
                WHERE genre_name = ?    
            `, [genre.name]);
            if (genreData.length > 0) {
                genreID = genreData[0].genre_id;
            } else {
                const genreResult = await pool.query(`
                    INSERT INTO Genres (genre_name) VALUE (?)    
                `, [genre.name]);
                genreID = genreResult.insertId;
            }
            const [genreData2] = await pool.query(`
                SELECT * FROM GameGenre
                WHERE game_id = ? AND genre_id = ?    
            `, [gameID, genreID]);
            if (genreData2.length === 0) {
                await pool.query(`
                    INSERT INTO GameGenre (game_id, genre_id) VALUES (?, ?)    
                `, [gameID, genreID]);
            }
        }

        //INSERT INTO GamePlatform
        for (const platform of game.platforms) {
            const [platData] = await pool.query(`
                SELECT platform_id
                FROM Platforms
                WHERE platform_name = ?    
            `, [platform.name]);
            if (platData.length > 0) {
                platformID = platData[0].platform_id;
            } else {
                const platResult = await pool.query(`
                    INSERT INTO Platforms (platform_name) VALUE (?)    
                `, [platform.name]);
                platformID = platResult.insertId;
            }
            const [platData2] = await pool.query(`
                SELECT * FROM GamePlatform
                WHERE game_id = ? AND platform_id = ?    
            `, [gameID, platformID]);
            if (platData2.length === 0) {
                await pool.query(`
                    INSERT INTO GamePlatform (game_id, platform_id) VALUES (?, ?)    
                `, [gameID, platformID]);
            }
        }        
    }
}