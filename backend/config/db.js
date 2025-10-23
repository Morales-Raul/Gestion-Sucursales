const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'AkyqtMcAIAuGwezSAAOqlnOIXewDtLml', {
  host: 'shuttle.proxy.rlwy.net',
  port: 14807,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;