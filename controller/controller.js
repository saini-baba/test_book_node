const book = require("../model/model");

exports.add = async (req, res) => {
  const { title, author } = req.body;
  const newpath = req.body.newpath;
  try {
    const existingBook = await book.findOne({
      where: { title: title, author: author },
    });

    if (existingBook) {
      return res.status(400).json({
        error: "book already exists",
      });
    }

    const newBook = await book.create({
      title: title,
      author: author,
      file: newpath,
    });
    if (newBook) {
      res.status(200).send("Book added");
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while adding the book.",
    });
  }
};

exports.data = async (req, res) => {
  try {
    const books = await book.findAll();

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found." });
    }
    return res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching data." });
  }
};

exports.update = async (req, res) => {
  const { title, author } = req.body;
  const { id } = req.params;
  const newpath = req.body.newpath;

  try {
    
    const Book = book.update(
      {
        title: title,
        author: author,
        file: newpath,
      },
      {
        where: { id: id },
      }
    );
    if (Book) {
      res.status(200).send("Book updated");
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while adding the book.",
    });
  }
};
