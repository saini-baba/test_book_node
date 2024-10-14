const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/db");
const user_route = require("./routes/routes");
const path = require("path");
// const multer = require("multer");
app.use(cors());
// const upload = multer();
// app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use("/book", user_route);
app.listen(8000, () => {
  console.log("running");
});
