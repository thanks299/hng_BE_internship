import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

// Your genderize endpoint
app.get('/api/genderize', async (req, res) => {
  // Your logic here
});

module.exports = app;