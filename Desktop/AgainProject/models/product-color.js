const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ProductColor = sequelize.define(
  "product-color",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProductColor;
