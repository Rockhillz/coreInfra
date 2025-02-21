// const { Pool } = require('pg');  // Import PostgreSQL client
// require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
// });

// // Attempt to connect to the database
// pool.connect()
//   .then(() => console.log(`🗃️  💡 Connected to PostgreSQL😍😂😍`)) // Success message
//   .catch(err => console.error(`❌Connection error❌`, err)); // Handle connection errors

// module.exports = pool; 

const knex = require("knex");
const knexConfig = require("../knexfile"); // Import Knex config

// Initialize Knex with the correct environment
const db = knex(knexConfig[process.env.NODE_ENV || "development"]);

module.exports = db;
