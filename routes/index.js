var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/abc', function (req, res, next) {
  res.send({
    'list': 'chenggong'
  })
});

module.exports = router;
