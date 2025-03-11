import express from 'express';
import cors from 'cors';
import api from './api/api.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API
app.use("/api", api);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'An unexpected error occurred'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});