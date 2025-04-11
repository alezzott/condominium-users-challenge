import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database and tables have been created successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database or synchronize:', error);
  });

export default sequelize;
