const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./kids-learning.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the kids-learning database.');
});

// Create users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Users table created or already exists.');
    });
});

module.exports = db;
