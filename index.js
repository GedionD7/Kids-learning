const express = require('express');
const path = require('path');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// You should move all your html files into a 'public' folder.
app.use(express.static(path.join(__dirname)));

// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            res.status(500).send('Error on the server.');
            return;
        }
        if (!row) {
            res.status(404).send('No user found.');
            return;
        }
        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                res.redirect('/home.html');
            } else {
                res.status(401).send('Password not valid.');
            }
        });
    });
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.status(500).send('Error hashing password.');
            return;
        }
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
            if (err) {
                res.status(409).send('Username already exists.');
                return;
            }
            res.redirect('/home.html');
        });
    });
});

// Serve all other html files after login
const pages = [
    'home.html',
    'english-alphabet.html',
    'amharic-alphabet.html',
    'numbers.html',
    'colors.html',
    'shapes.html',
    'body-parts.html',
    'family.html',
    'stories.html',
    'animals.html',
    'games.html',
    'vegetables.html',
    'fruits.html'
];

pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, page));
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
