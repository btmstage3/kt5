require('dotenv').config();

const sqlLogger = (msg) => {
  console.log('📦 SQL:', msg);
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: sqlLogger 
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres',
    logging: false       
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false       
  }
};
