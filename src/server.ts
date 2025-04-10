import express from 'express';

const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  res.json({ message: 'listen' });
});

app.listen(PORT, () => {
  console.log('server is listening');
});

export default app;
