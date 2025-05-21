const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator"); 

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance
  .find()
  .populate("book")
  .exec();

  res.render("bookinstance_list", {
    title: "Список екземплярів книг",
    bookinstance_list: allBookInstances,
  });
});

/*exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance list");
}); */
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
});

exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find().sort({ title: 1 }).exec();
  
  res.render("bookinstance_form", {
    title: "Створити екземпляр книги",
    books: allBooks,
  });
});

exports.bookinstance_create_post = [
  // Валідація та очищення полів
  body("book", "Книга повинна бути обрана.").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Видавництво не повинно бути порожнім.").trim().isLength({ min: 1 }).escape(),
  body("due_back", "Недійсна дата.").optional({ values: "falsy" }).isISO8601().toDate(),
  body("status").escape(),

  // Обробка запиту після валідації
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find().sort({ title: 1 }).exec();
      res.render("bookinstance_form", {
        title: "Створити екземпляр книги",
        books: allBooks,
        bookInstance,
        errors: errors.array(),
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete GET");
});
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
});
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
});
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
});
