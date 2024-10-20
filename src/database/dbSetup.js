import mysql from 'mysql2/promise';


export async function dbSetup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    console.log("Connected to MySQL database server");

    await connection.query("CREATE DATABASE IF NOT EXISTS game_collection_tracker_db");
    console.log("Database created");

    await connection.query("USE game_collection_tracker_db");

    //Users Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Users(
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            user_email VARCHAR(255) UNIQUE NOT NULL,
            user_password_hash VARCHAR(255) NOT NULL,
            user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    //Developers Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Developers(
            developer_id INT AUTO_INCREMENT PRIMARY KEY,
            developer_name VARCHAR(255) NOT NULL
        );
    `);

    //Publishers Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Publishers(
            publisher_id INT AUTO_INCREMENT PRIMARY KEY,
            publisher_name VARCHAR(255) NOT NULL
        );
    `);

    //Games Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Games(
            game_id INT AUTO_INCREMENT PRIMARY KEY,
            developer_id INT,
            publisher_id INT, 
            game_title VARCHAR(255),
            game_description TEXT,
            game_release_date DATE,
            game_average_time VARCHAR(255),
            game_image_url VARCHAR(255),
            FOREIGN KEY (developer_id) REFERENCES Developers(developer_id),
            FOREIGN KEY (publisher_id) REFERENCES Publishers(publisher_id)
        );
    `);

    //Platforms Table 
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Platforms(
            platform_id INT AUTO_INCREMENT PRIMARY KEY,
            platform_name VARCHAR(255) NOT NULL
        );
    `);

    //GamePlatform Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS GamePlatform(
            game_id INT NOT NULL,
            platform_id INT NOT NULL,
            PRIMARY KEY (game_id, platform_id),
            FOREIGN KEY (game_id) REFERENCES Games(game_id),
            FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id)
        );
    `);

    //Genres Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS Genres(
            genre_id INT AUTO_INCREMENT PRIMARY KEY,
            genre_name VARCHAR(255) NOT NULL
        );
    `);

    //GameGenre Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS GameGenre(
            game_id INT NOT NULL,
            genre_id INT NOT NULL,
            PRIMARY KEY (game_id, genre_id),
            FOREIGN KEY (game_id) REFERENCES Games(game_id),
            FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
        );
    `);

    //UserCollection Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS UserCollection(
            user_collection_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            game_id INT NOT NULL,
            status ENUM('Completed', 'Playing', 'Dropped', 'Plan to Play') NOT NULL DEFAULT 'Playing',
            FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
            FOREIGN KEY (game_id) REFERENCES Games(game_id)
        );
    `);

    //RefreshToken Table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS RefreshToken(
            refresh_token_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            refresh_token TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );    
    `);
}
