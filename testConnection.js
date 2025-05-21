const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://slushniaka:ZB2xBZayTnzN8C1Y@cluster0.7bcbl.mongodb.net/local_library?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Успішно підключено до MongoDB"))
    .catch(err => console.error("Помилка підключення:", err));
    