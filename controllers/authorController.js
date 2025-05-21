const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find()
    .sort({ family_name: 1 })
    .exec();

  res.render("author_list", {
    title: "Список авторів",
    author_list: allAuthors,
  });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (!author) {
    const err = new Error("Автор не знайдений");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Деталі автора",
    author,
    author_books: allBooksByAuthor,
  });
});

  // Відображення форми створення автора при GET-запиті. 
  exports.author_create_get = asyncHandler(async (req, res, next) => {
    res.render("author_form", { title: "Створити автора" });
  });

  exports.author_create_post = [
    // Валідація та очищення полів
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Ім'я повинно бути вказано.")
      .isAlphanumeric()
      .withMessage("Ім'я містить неалфанумерні символи."),
    body("family_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Прізвище повинно бути вказано.")
      .isAlphanumeric()
      .withMessage("Прізвище містить неалфанумерні символи."),
    body("date_of_birth", "Недійсна дата народження")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
    body("date_of_death", "Недійсна дата смерті")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
  
    // Обробка запиту після валідації та очищення
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
  
      if (!errors.isEmpty()) {
        res.render("author_form", {
          title: "Створити автора",
          author,
          errors: errors.array(),
        });
        return;
      } else {
        await author.save();
        res.redirect(author.url);
      }
    }),
  ];
  
  exports.author_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET");
  });
  exports.author_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST");
  });
  exports.author_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET");
  });
  exports.author_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST");
  });