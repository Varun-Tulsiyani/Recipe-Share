const mysql = require('mysql');
require('dotenv').config();

con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Insert some values
const recipe1 = `
INSERT INTO recipes (
    title,
    description,
    ingredients,
    instructions,
    cooking_time,
    serving_size,
    username
) VALUES (
    'Spaghetti Bolognese',
    'A classic Italian pasta dish with rich, meaty sauce.',
    'Spaghetti, Ground Beef, Tomato Sauce, Garlic, Onion, Olive Oil',
    'Boil the spaghetti, Cook the ground beef, Add tomato sauce and simmer, Mix with spaghetti',
    30,
    2,
    'test'
);
`;

const recipe2 = `
INSERT INTO recipes (
    title,
    description,
    ingredients,
    instructions,
    cooking_time,
    serving_size,
    username
) VALUES (
    'Chicken Tikka Masala',
    'A flavorful Indian curry with marinated chicken pieces in a creamy sauce.',
    'Chicken, Yogurt, Tomato Paste, Garlic, Ginger, Spices',
    'Marinate the chicken in yogurt and spices, Cook the chicken, Prepare the sauce, Combine chicken and sauce',
    true,
    60,
    3,
    'test'
);
`;

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    con.query(recipe1, (err, results) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return;
        }
        console.log('Inserted Recipe 1');
        con.end();
    });

    con.query(recipe2, (err, results) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            return;
        }
        console.log('Inserted Recipe 2');
        con.end();
    });
});