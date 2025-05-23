const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Головна сторінка бібліотеки
exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Домашня сторінка Local Library",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// Відображення списку всіх книг
exports.book_list = asyncHandler(async (req, res, next) => {
  try {
    const allBooks = await Book.find({}, "title author") // Отримуємо тільки title і author
      .sort({ title: 1 }) // Сортуємо за назвою
      .populate("author") // Заповнюємо інформацію про автора
      .exec();

    console.log("Отримані книги:", allBooks);
    res.render("book_list", { title: "Список книг", book_list: allBooks });
  } catch (err) {
    console.error("Помилка в book_list:", err);
    next(err);
  }
});

// Відображення сторінки деталей для конкретної книги.
exports.book_detail = asyncHandler(async (req, res, next) => {
  // Отримання деталей книг, екземплярів книг для конкретної книги
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    // Немає результатів.
    const err = new Error("Книгу не знайдено");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances,
  });
});

// Форми створення книги
exports.book_create_get = asyncHandler(async (req, res, next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("book_form", {
    title: "Створити книгу",
    authors: allAuthors,
    genres: allGenres,
  });
});

exports.book_create_post = [
  // Перетворення жанру на масив
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Валідація та очищення полів
  body("title", "Назва не повинна бути порожньою.").trim().isLength({ min: 1 }).escape(),
  body("author", "Автор не повинен бути порожнім.").trim().isLength({ min: 1 }).escape(),
  body("summary", "Опис не повинен бути порожнім.").trim().isLength({ min: 1 }).escape(),
  body("isbn", "ISBN не повинен бути порожнім.").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  // Обробка запиту після валідації
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      res.render("book_form", {
        title: "Створити книгу",
        authors: allAuthors,
        genres: allGenres,
        book,
        errors: errors.array(),
      });
      return;
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

// Видалення книги
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Оновлення книги
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});