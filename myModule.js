const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function authenticateUser(email, password, callback) {
    pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
}

function registerUser(username, email, password, callback) {
    pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
        if (err) return callback(err);
        callback(null);
    });
}

function getRecipeByTitle(title, callback) {
    pool.query('SELECT * FROM recipes WHERE title = ?', [title], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
}

function getRecipeById(id, callback) {
    pool.query('SELECT * FROM recipes WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            return callback(null, results[0]);
        } else {
            return callback(null, null);
        }
    });
}

function getUserRecipes(username, callback) {
    pool.query('SELECT * FROM recipes WHERE username = ?', [username], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

function submitRecipe(title, description, ingredients, instructions, cookingTime, servingSize, username, callback) {
    pool.query('INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, serving_size, username) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, ingredients, instructions, cookingTime, servingSize, username], (err, results) => {
            if (err) return callback(err);
            callback(null);
        });
}

function editRecipe(title, description, ingredients, instructions, cookingTime, servingSize, id, username, callback) {
    pool.query('UPDATE recipes SET title = ?, description = ?, ingredients = ?, instructions = ?, cooking_time = ?, serving_size = ? WHERE id = ? AND username = ?',
        [title, description, ingredients, instructions, cookingTime, servingSize, id, username], (err, results) => {
            if (err) return callback(err);
            callback(null);
        });
}

function deleteRecipe(id, username, callback) {
    pool.query('DELETE FROM recipes WHERE id = ? AND username = ?', [id, username], (err, results) => {
        if (err) return callback(err);
        callback(null);
    });
}

function getFeaturedRecipes(callback) {
    pool.query('SELECT * FROM recipes WHERE featured = TRUE', (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
}

module.exports = {
    authenticateUser,
    registerUser,
    getRecipeByTitle,
    getRecipeById,
    getUserRecipes,
    submitRecipe,
    editRecipe,
    deleteRecipe,
    getFeaturedRecipes
}