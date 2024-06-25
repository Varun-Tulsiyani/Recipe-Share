// Create a connection to the MySQL server
let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: 'root'
});

// Create database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    const sql_database = "CREATE DATABASE recipe_share";
    con.query(sql_database, function (err, result) {
        if (err) throw err;
        console.log("Database Created");
    });
});