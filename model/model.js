const { DataTypes } = require("sequelize");
const database = require("../db/db");

const book = database.db.define(
  "book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING(500),
      allowNull: true,
      unique: true,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

book.sync();
module.exports = book;
