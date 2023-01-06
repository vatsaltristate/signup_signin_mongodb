const express = require('express');
const env = require('dotenv').config()
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& MongoDB Connection Succeeded &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

// console.log("db *************************************************************",db);

app.use(session({
  secret: 'vatsal kachhadiya',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/user.route');
app.use('/', index);

// error handling
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  next(err);
});

// error handler

app.use(function (err, req, res, next) {
  res.send(err.message);
});


app.listen(PORT, function () {
  console.log('======================== >>>>>>>>>>>>>>>>>>>>>> Server is started on http://localhost:'+PORT);
});
