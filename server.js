const express = require('express');
const cors = require('cors'); // Import the CORS package
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the user
    db.get(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, user) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (user) {
                res.json({ success: true, user });
            } else {
                res.json({ success: false, message: 'Invalid email or password' });
            }
        }
    );
});

// API Endpoint for Assets
app.get('/api/assets', (req, res) => {
    db.all('SELECT * FROM assets', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API Endpoint for Users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Add a new asset
app.post('/api/assets', (req, res) => {
    const { name, quantity, status } = req.body;

    db.run(
        'INSERT INTO assets (name, quantity, status) VALUES (?, ?, ?)',
        [name, quantity, status],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Update an asset
app.put('/api/assets/:id', (req, res) => {
    const { name, quantity, status } = req.body;
    const { id } = req.params;

    db.run(
        'UPDATE assets SET name = ?, quantity = ?, status = ? WHERE id = ?',
        [name, quantity, status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ changes: this.changes });
        }
    );
});

// Delete an asset
app.delete('/api/assets/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM assets WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ changes: this.changes });
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (user) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        // Insert the new user into the database
        db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, 'User'],
            function (err) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error' });
                }
                res.json({ success: true });
            }
        );
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

