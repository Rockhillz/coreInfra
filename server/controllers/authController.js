const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/databasePG');
require('dotenv').config();

// REGISTER USER........ working
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role = "Admin" } = req.body; // Default role to 'Admin' if not provided

        // Check if user already exists
        const userExists = await db("users").where({ email }).first();
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const [newUser] = await db("users")
            .insert({
                name,
                email,
                password_hash: hashedPassword,
                role,
            })
            .returning(["id", "name", "email", "role", "created_at", "updated_at"]);

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Server error");
    }
};


// 🔑 LOGIN USER...... working
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await db("users")
            .select("id", "name", "email", "password_hash", "role")
            .where({ email })
            .first();

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token (including role for role-based access)
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ 
            message: "Login successful", 
            token, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });

    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).send("Server error");
    }
};