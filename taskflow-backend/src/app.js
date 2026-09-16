import express from 'express';
import cors from 'cors';

const app = express();

// Middleware - Required to accept the Json data in body from client side
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// cors
app.use(cors());
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'server is running smoothly....',
  });
});

export default app;
