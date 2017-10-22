var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Spread Model Tests' });
});

module.exports = router;
