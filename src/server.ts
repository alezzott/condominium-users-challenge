import express from 'express';
import sequelize from './config/database';
import boletoRoutes from "./routes/boleto-routes"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/boletos', boletoRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
