const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../databasePG');
require('dotenv').config();

// REGISTER USER........ working
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role = 'Admin' } = req.body; // Default role to 'User' if not provided

        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password_hash, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, name, email, role, created_at, updated_at`,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// 🔑 LOGIN USER...... working
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userQuery = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1', [email]);

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = userQuery.rows[0];

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token (including role for role-based access)
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};