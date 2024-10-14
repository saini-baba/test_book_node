const multer = require("multer");
const path = require("path");
const book = require("../model/model");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: async function (req, file, cb) {
    if (req.body.title) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const newFileName = `${formattedDate}-${req.body.title}${path.extname(
        file.originalname
      )}`;
      req.body.newpath = `uploads/${newFileName}`;
      cb(null, newFileName);
    } else {
      cb(new Error("Title is missing in the request body!"));
    }
  },
});

const updatestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: async function (req, file, cb) {
    if (req.body.title) {
      const { id } = req.params;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const newFileName = `${formattedDate}-${req.body.title}${path.extname(
        file.originalname
      )}`;
      const record = await book.findByPk(id);
      if (!record) {
        return res.status(404).send({ error: "Record not found" });
      }
      const oldImagePath = record.file;
      if (oldImagePath === file.originalname) {
        return next();
      } else {
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              return res
                .status(500)
                .send({ error: "Error deleting old image" });
            }
          });
        }
      }
      req.body.newpath = `uploads/${newFileName}`;
      cb(null, newFileName);
    } else {
      cb(new Error("Title is missing in the request body!"));
    }
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
}).single("file");

const updateupload = multer({
  storage: updatestorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
}).single("file");

exports.uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send({
          error: "Maximum allowed size is 5MB",
        });
      }
      return res.status(400).send({ error: err.message });
    } else if (err) {
      return res.status(400).send({ error: err.message });
    }
    next();
  });
};

exports.updateImage = async (req, res, next) => {
  try {
    updateupload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({ error: "Maximum allowed size is 5MB" });
        }
        return res.status(400).send({ error: err.message });
      } else if (err) {
        return res.status(400).send({ error: err.message });
      }
      next();
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
