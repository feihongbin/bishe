var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var groupRouter = require('./routes/group');
var uploadRouter = require('./routes/upload');



var app = express();
var http = require('http');
var server = http.createServer(app);


// 即时通讯
const instantApp = express();
const instantServer = instantApp.listen(8082);
// const { Server } = require("socket.io");
// const io = new Server(server);
// var io = require('socket.io')(instantServer)
// const { Server } = require("socket.io");
const io = require('socket.io').listen(instantServer)

// io.on('connection', (socket) => {
//   console.log('socket connect')
//   // 接收信息
//   socket.on('message', data => {
//     console.log(socket)
//     socket.emit('news', 'emit 成功')
//   })
// })
require('./utils/socket')(io)




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//----- 配置跨域 -----
// express框架解决跨域问题的代码，注意该代码要放在 app.use(router); 之前
// app.all('*', (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8");
//   console.log(req.method)

//   if (req.method.toLocaleLowerCase() === 'options') {
//     res.send
//   } else {
//     next();

//   }
// });
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Access-Control-Allow-Headers,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
})

app.use(express.static(__dirname + '/public'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/group', groupRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000)
