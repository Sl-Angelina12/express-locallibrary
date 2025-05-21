const mongoose = require("mongoose");
require("dotenv").config(); // Завантаження змінних середовища

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("Помилка підключення до MongoDB:", err);
        process.exit(1); 
    }
};

module.exports = connectDB;
