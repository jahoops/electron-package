var express = require('express');
var router = express.Router();
var nightmare = require('../utils/nightmareget');
var fs = require('fs');
var path = require('path');

//Load the list
var p = path.join(__dirname, '..', 'search.txt');
var searcharray = fs.readFileSync(p).toString().split(/\r?\n/);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { searches: searcharray });
});

router.post('/searchitem', (req, res) => {
  console.log('sending',nightmare);
  const watchEbayItem = new Promise((resolve, reject) => {
      nightmare
          .scrapeEbayItem(req.body.url)
          .then(data => {
              resolve(data);
          })
          .catch(err => reject('Ebay scrape failed'))
      });
      Promise.all([watchEbayItem])
          .then(data => {
              let upd = req.body;
              console.log('upd',upd);
              upd.count = data[0].count;
              res.json(upd);
          })
          .catch(err => res.status(500).send(err));
});

module.exports = router;
