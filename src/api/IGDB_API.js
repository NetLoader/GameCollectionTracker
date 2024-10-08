import axios from "axios";
import mysql from "mysql2/promise";

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
        `fields name, summary, first_release_date, genres.name, platforms.name, cover.image_id, rating, aggregated_rating, 
        involved_companies.company.name, involved_companies.publisher, involved_companies.developer;
        sort aggregated_rating desc;
        where rating >= 90 
            & category = 0
            & first_release_date >= 946702800
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
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    for (const game of gamesData) {
        let developerID = null;
        let publisherID = null;
        let gameID = null;
        let platformID = null;
        let genreID = null;

        //INSERT INTO Developers
        const developer = game.involved_companies.find(company => company.developer);
        if (developer) {
            const [developerData] = await connection.query(
                `SELECT developer_id 
                FROM Developers
                WHERE developer_name =?`, [developer.company.name]
            );
            if (developerData.length > 0) {
                developerID = developerData[0].developer_id;
            } else {
                const [developerResult] = await connection.query(
                    `INSERT INTO Developers (developer_name) VALUES (?)`, [developer.company.name]
                );
                developerID = developerResult.insertId;
            }
        }

        //INSERT INTO Publishers
        const publisher = game.involved_companies.find(company => company.publisher);
        if (publisher) {
            const [publisherData] = await connection.query(
                `SELECT publisher_id 
                FROM Publishers
                WHERE publisher_name =?`, [publisher.company.name]
            );
            if (publisherData.length > 0) {         
                publisherID = publisherData[0].publisher_id;
            } else {
                const [publisherResult] = await connection.query(
                    `INSERT INTO Publishers (publisher_name) VALUES (?)`, [publisher.company.name]
                );
                publisherID = publisherResult.insertId;
            }
        }

        //INSERT INTO Games
        const [gameData] = await connection.query(
            `INSERT INTO Games (developer_id, publisher_id, game_title, game_description, game_release_date, game_image_url)
            VALUES (?,?,?,?,?,?)`,
            [
                developerID,
                publisherID,
                game.name,
                game.summary,
                new Date(game.first_release_date * 1000),
                game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg` : null
            ] 
        ); 
        gameID = gameData.insertId;

        //INSERT INTO Platforms
        for (const platform of game.platforms) {
            const [platformData] = await connection.query(
                `SELECT platform_id
                FROM Platforms
                WHERE platform_name =?`, [platform.name]
            );
            if (platformData.length > 0) {     
                platformID = platformData[0].platform_id;    
            } else {
                const [platformResult] = await connection.query(
                    `INSERT INTO Platforms (platform_name) VALUE (?)`, [platform.name]
                );
                platformID = platformResult.insertId;
            }
        }

        //INSERT INTO GamePlatform
        await connection.query(
            `INSERT INTO GamePlatform (game_id, platform_id) VALUES (?, ?)`, [gameID, platformID]
        );

        //INSERT INTO Genres
        for (const genre of game.genres) {
            const [genreData] = await connection.query(
                `SELECT genre_id
                FROM Genres
                WHERE genre_name =?`, [genre.name]
            );
            if (genreData.length > 0) {          
                genreID = genreData[0].genre_id;    
            } else {
                const [genreResult] = await connection.query(
                    `INSERT INTO Genres (genre_name) VALUE (?)`, [genre.name]
                );
                genreID = genreResult.insertId;
            }
        }

        //INSERT INTO GameGenre
        await connection.query(
            `INSERT INTO GameGenre (game_id, genre_id) VALUES (?, ?)`, [gameID, genreID]
        );
    }
}