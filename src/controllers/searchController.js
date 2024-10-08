import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function getGamesByName(gameName) {
    try {
        const [games] = await pool.query(`
            SELECT * 
            FROM Games 
            WHERE game_title LIKE ?`, [`%${gameName}%`]);
        if (games.length > 0) {
            return games;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching game by name from controller: ", error);
        throw error;
    }
};

export async function getDevelopersByName(devName) {
    try {
        const [dev] = await pool.query(`
            SELECT * 
            FROM Developers 
            WHERE developer_name LIKE ?`, [`%${devName}%`]);
        if (dev.length > 0) {
            return dev;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching developers by name from controller: ", error);
        throw error;
    }
};

export async function getPublishersByName(publisherName) {
    try {
        const [pub] = await pool.query(`
            SELECT * 
            FROM Publishers 
            WHERE publisher_name LIKE ?`, [`%${publisherName}%`]);
        if (pub.length > 0) {
            return pub;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching publishers by name from controller: ", error);
        throw error;
    }
};

export async function getGenresByName(genreName) {
    try {
        const [genre] = await pool.query(`
            SELECT * 
            FROM Genres 
            WHERE genre_name LIKE ?`, [`%${genreName}%`]);
        if (genre.length > 0) {
            return genre;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching genre by name from controller: ", error);
        throw error;
    }
};

export async function getPlatformsByName(platformName) {
    try {
        const [platform] = await pool.query(`
            SELECT * 
            FROM Platforms 
            WHERE platform_name LIKE ?`, [`%${platformName}%`]);
        if (platform.length > 0) {
            return platform;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching platform by name from controller: ", error);
        throw error;
    }
};

