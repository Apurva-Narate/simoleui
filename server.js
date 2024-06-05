const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'root',
    port: 5432,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length === 1) {
            res.redirect('/home.html');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred');
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
        res.redirect('/home.html');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('An error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
