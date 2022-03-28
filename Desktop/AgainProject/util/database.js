const Sequelize = require("sequelize");

const sequelize = new Sequelize("test2", "anshul", "Anshul@123", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
