var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.send('contacts 이후 url');
});
router.get('/detail', function(req, res) {
    res.send('contacts/detail 이후 url');
});
  module.exports = router;