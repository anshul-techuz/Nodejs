const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const sequelize = require("./util/database");
const adminroutes = require("./routes/admin");
const multer = require("multer");
const authroutes = require("./routes/auth");
const prodRoutes = require("./routes/product");
const User = require("./models/user");
const Product = require("./models/product");
const Color = require("./models/color");
const ProductColor = require("./models/product-color");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: {
    name: "ownerId",
  },
});
User.hasMany(Product, {
  foreignKey: {
    name: "ownerId",
  },
});
Color.belongsToMany(Product, { through: ProductColor, onDelete: "CASCADE" });
Product.belongsToMany(Color, { through: ProductColor, onDelete: "CASCADE" });
ProductColor.belongsTo(Product);
ProductColor.belongsTo(Color);
app.use(authroutes);
app.use(prodRoutes);
app.use(adminroutes);
sequelize
  //   .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
