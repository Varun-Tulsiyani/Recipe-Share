const mysql = require('mysql');
require('dotenv').config();

con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Create tables
const createUserTable = `
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
`;

const createRecipeTable = `
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INT NOT NULL,
    serving_size INT NOT NULL,
    featured BOOLEAN DEFAULT TRUE,
    username VARCHAR(255) NOT NULL
);
`;

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    con.query(createUserTable, (err, results) => {
        if (err) {
            console.error('Error creating tables:', err);
            return;
        }
        console.log('Tables created or already exist');
        con.end();
    });

    con.query(createRecipeTable, (err, results) => {
        if (err) {
            console.error('Error creating tables:', err);
            return;
        }
        console.log('Tables created');
        con.end();
    });
});