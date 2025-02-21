const express = require('express');
const cors = require('cors');
require('dotenv').config();

// import swagger for documentation
const { swaggerDocs, swaggerUi } = require('./swagger')


// Import routes
const authRoutes = require('./routes/authRoutes');
const cardProfileRoutes = require('./routes/cardProfileRoutes');
const cardRequestRoutes = require('./routes/cardRequestRoutes');



const app = express();
app.use(express.json());
app.use(cors());

// MOUNT API Routes
app.use('/api/auth', authRoutes);
app.use('/api', cardProfileRoutes);
app.use('/api', cardRequestRoutes);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.send(`Card API is running...Database time: ${result.rows[0].now}`);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(` 💡⚡💡 Server running on port ${PORT} 💡⚡💡`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);

});
