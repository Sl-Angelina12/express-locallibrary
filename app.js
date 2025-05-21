// Імпорт необхідних модулів
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config(); // Завантаження змінних середовища

// Безпека та продуктивність
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Підключення до MongoDB
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Помилка підключення до MongoDB:", err);
        process.exit(1);
    }
};
connectDB(); // Викликаємо функцію підключення до бази даних

// Створення застосунку Express
const app = express();

// Додаткові проміжні програмні засоби для безпеки та продуктивності
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    })
);
app.use(compression()); // Стиснення відповідей для продуктивності
app.use(logger("combined")); // Логування запитів

// Обмеження швидкості запитів (1.4)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // Максимум 100 запитів за 15 хвилин
    message: "Занадто багато запитів. Спробуйте пізніше.",
});
app.use("/api", limiter);

// Налаштування парсингу запитів
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, "public")));

// Імпорт маршрутів
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

// Використання маршрутів
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// Обробка помилок (без трасування стека)
app.use((req, res, next) => {
    res.status(404).send("Сторінку не знайдено");
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", { message: "Щось пішло не так. Спробуйте пізніше." });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Експорт застосунку
module.exports = app;

