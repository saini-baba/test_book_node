const express = require("express");
const router = express.Router();
const controler = require("../controller/controller.js");
const middleware = require("../middleware/middleware.js");
router.post("/add", middleware.uploadMiddleware, controler.add);
router.get("/data", controler.data);
router.put("/update/:id", middleware.updateImage, controler.update);

module.exports = router;
