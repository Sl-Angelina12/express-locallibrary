var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* router.get("/", function (req, res) {
  res.redirect("/catalog");
}); */

console.log('Маршрут /my-page завантажено');
router.get('/my-page', (req, res) => {
  console.log("Запит отримано на /my-page"); 
  res.render('my_page', { title: 'My route', items: ['Element 1', 'Element 2', 'Element 3'] });
});

console.log("Файл routes/index.js завантажено");

module.exports = router;
