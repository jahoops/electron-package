var express = require('express');
var router = express.Router();
var nightmare = require('./utils/nightmareget');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var index = require('./main');

var app = express();

module.exports = function(filePath) {
    var searcharray = fs.readFileSync(filePath).toString().split(/\r?\n/);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { searches: searcharray });
});

router.post('/searchitem', (req, res) => {
    var uri = req.body.url.trim();
    console.log('sending',uri);
  const watchEbayItem = new Promise((resolve, reject) => {
      nightmare
          .scrapeEbayItem(uri)
          .then(data => {
              console.log('----->', data);
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

app.use(express.static(path.join(__dirname, 'vendor')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
  
const server = app.listen(3000, () => console.log(`Express server listening on port 3000`));

}
