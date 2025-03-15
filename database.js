const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Initialize the database with tables
db.serialize(() => {
    // Create the "assets" table
    db.run(`
        CREATE TABLE IF NOT EXISTS assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            status TEXT NOT NULL
        )
    `);

    // Create the "users" table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `);

    // Insert dummy data (optional)
    db.run(`
        INSERT OR IGNORE INTO assets (name, quantity, status)
        VALUES 
            ('Laptop Dell XPS 13', 10, 'Available'),
            ('Projector Epson', 5, 'Out'),
            ('Printer HP', 2, 'Available')
    `);

    db.run(`
        INSERT OR IGNORE INTO users (name, email, password, role)
        VALUES 
            ('John Doe', 'john@example.com', 'password123', 'Admin'),
            ('Jane Smith', 'jane@example.com', 'password123', 'User')
    `);
});

module.exports = db;