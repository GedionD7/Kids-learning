const express = require('express');
const path = require('path');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
// Use the port Render provides, or default to 3000 for local development
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, etc.) from the main project directory
app.use(express.static(__dirname));

// Serve login page at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        if (!row) {
            return res.status(404).send('No user found with that username.');
        }
        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                // On successful login, redirect to the home page
                res.redirect('/home.html');
            } else {
                res.status(401).send('Incorrect password.');
            }
        });
    });
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password.');
        }
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
            if (err) {
                // This error occurs if the username is not unique
                return res.status(409).send('Username already exists. Please choose another.');
            }
            // On successful signup, redirect to the home page
            res.redirect('/home.html');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running and listening on port ${PORT}`);
});
