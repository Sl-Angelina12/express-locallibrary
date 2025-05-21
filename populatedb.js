const mongoose = require("mongoose");
const Genre = require("./models/genre");
const Author = require("./models/author");
const Book = require("./models/book");
const BookInstance = require("./models/bookinstance");

const mongoDB = process.argv[2];

mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const genres = [];
const authors = [];
const books = [];
const bookInstances = [];

// Функція очищення бази даних
async function clearDatabase() {
  console.log("Clearing database...");
  await Genre.deleteMany({});
  await Author.deleteMany({});
  await Book.deleteMany({});
  await BookInstance.deleteMany({});
  console.log("Database cleared!");
}

// Функція для створення жанру
async function genreCreate(name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres.push(genre);
  console.log(`Added genre: ${name}`);
}

// Функція для створення автора
async function authorCreate(first_name, family_name, date_of_birth, date_of_death) {
  const author = new Author({
    first_name: first_name,
    family_name: family_name,
    date_of_birth: date_of_birth,
    date_of_death: date_of_death,
  });
  await author.save();
  authors.push(author);
  console.log(`Added author: ${first_name} ${family_name}`);
}

// Функція для створення книги
async function bookCreate(title, author, genre, summary, isbn) {
  const book = new Book({
    title: title,
    author: author,
    genre: genre,
    summary: summary,
    isbn: isbn,
  });
  await book.save();
  books.push(book);
  console.log(`Added book: ${title}`);
}

// Функція для створення екземпляра книги
async function bookInstanceCreate(book, imprint, status, due_back) {
  const bookInstance = new BookInstance({
    book: book,
    imprint: imprint,
    status: status,
    due_back: due_back,
  });
  await bookInstance.save();
  bookInstances.push(bookInstance);
  console.log(`Added book instance: ${imprint}`);
}

// Головна функція
async function main() {
  try {
    console.log("Populating database...");

    // Очищення бази перед створенням
    await clearDatabase();

    // Додавання жанрів
    await genreCreate("Fantasy");
    await genreCreate("Science Fiction");
    await genreCreate("Romance");

    // Додавання авторів
    await authorCreate("Patrick", "Rothfuss", "1973-06-06", null);
    await authorCreate("Brandon", "Sanderson", "1975-12-19", null);
    await authorCreate("Terry", "Pratchett", "1948-04-28", "2015-03-12");
    await authorCreate("Marie", "Curie", "1867-11-07", "1934-07-04");
    await authorCreate("Isaac", "Newton", "1643-01-04", "1727-03-31");
    await authorCreate("Ben", "Bova", "1932-11-08", "2020-03-29"); //-----

    // Додавання книг
    await bookCreate(
      "The Name of the Wind",
      authors[0]._id,
      [genres[0]._id],
      "A tale of a gifted young musician and magician's rise to fame.",
      "123456789"
    );
    await bookCreate(
      "Mistborn",
      authors[1]._id,
      [genres[1]._id],
      "A unique magical system and a gripping story of rebellion.",
      "987654321"
    );
    await bookCreate(
      "The Colour of Magic",
      authors[2]._id,
      [genres[2]._id],
      "The first adventure of Discworld's Rincewind and Twoflower.",
      "555666777"
    );
    await bookCreate(
      "Marie Curie's Quest",
      authors[3]._id,
      [genres[0]._id],
      "A dramatized exploration of the great scientist's life.",
      "444555666"
    );
    await bookCreate(
      "Principia Mathematica",
      authors[4]._id,
      [genres[1]._id],
      "The groundbreaking work of Isaac Newton.",
      "333444555"
    );
    await bookCreate(
      "Wise Man's Fear",
      authors[0]._id,
      [genres[2]._id],
      "The second part of Kvothe's journey in search of answers.",
      "222333444"
    );
    await bookCreate(
      "Stormlight Archive",
      authors[1]._id,
      [genres[0]._id],
      "An epic story of knights, magic, and destiny.",
      "111222333"
    );

    // Додавання екземплярів книг
    await bookInstanceCreate(
      books[0]._id,
      "First Edition, Hardcover",
      "Available",
      new Date()
    );
    await bookInstanceCreate(
      books[1]._id,
      "Collectors' Edition, Signed",
      "Loaned",
      new Date()
    );
    await bookInstanceCreate(
      books[2]._id,
      "Paperback Edition",
      "Reserved",
      new Date()
    );
    await bookInstanceCreate(
      books[3]._id,
      "Library Copy, Special Edition",
      "Available",
      new Date()
    );
    await bookInstanceCreate(
      books[4]._id,
      "Mass Market Edition",
      "Loaned",
      new Date()
    );
    await bookInstanceCreate(
      books[5]._id,
      "Limited Print, Hardcover",
      "Maintenance",
      new Date()
    );
    await bookInstanceCreate(
      books[6]._id,
      "Deluxe Edition",
      "Available",
      new Date()
    );
    await bookInstanceCreate(
      books[0]._id,
      "Anniversary Edition",
      "Loaned",
      new Date()
    );
    await bookInstanceCreate(
      books[1]._id,
      "Exclusive Cover Edition",
      "Reserved",
      new Date()
    );
    await bookInstanceCreate(
      books[2]._id,
      "Second Edition",
      "Maintenance",
      new Date()
    );
    await bookInstanceCreate(
      books[3]._id,
      "Collector's Vault Edition",
      "Available",
      new Date()
    );

    console.log("Database populated successfully!");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();
