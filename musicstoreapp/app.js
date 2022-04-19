var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

const userSessionRouter = require('./routes/userSessionRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');
app.use("/songs/add", userSessionRouter);
app.use("/publications", userSessionRouter);
app.use("/songs/buy", userSessionRouter);
app.use("/purchases", userSessionRouter);
app.use("/audios/", userAudiosRouter);
app.use("/shop/", userSessionRouter);

const userAuthorRouter = require('./routes/userAuthorRouter');
app.use("/songs/edit", userAuthorRouter);
app.use("/songs/delete", userAuthorRouter);

let crypto = require('crypto');
let fileUpload = require('express-fileupload');
app.use(fileUpload({limits: {fileSize: 50 * 1024 * 1024}, createParentPath: true}));

app.set('uploadPath', __dirname);
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

let bodyParser = require('body-parser');
app.use(bodyParser.json()); //para poder procesar JSON
app.use(bodyParser.urlencoded({extended: true})); // para poder procesar formularios estandar

let indexRouter = require('./routes/index');
//require("./routes/songs.js")(app);
//require("./routes/authors.js")(app);

const {MongoClient} = require("mongodb");
const url = "mongodb+srv://admin:sdi@tiendamusical.xtcgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";//'mongodb+srv://admin:sdi@tiendamusical.hy8gh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
app.set('connectionStrings', url);

let commentsRepository = require("./repositories/commentsRepository.js");
commentsRepository.init(app, MongoClient);
require("./routes/comments.js")(app, commentsRepository);

const songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, MongoClient);
require("./routes/songs.js")(app, songsRepository);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
require("./routes/api/songsAPIv1.0.js")(app, songsRepository);

const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);
require("./routes/users.js")(app, usersRepository);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log("Se ha producido un error" + err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
