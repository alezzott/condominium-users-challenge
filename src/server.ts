import express from 'express';
import sequelize from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/test', (req, res) => {
  res.json({ message: 'listen' });
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
