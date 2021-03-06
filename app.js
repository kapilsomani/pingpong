var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
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

//bind server to a host and port
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("ping-pong server listening on port http://127.0.0.1:" + port);

//create a socket
var sio = require('socket.io')(server);
sio.on('connection',function(socket) {
  console.log('Web client connected');
  socket.emit('ss-confirmation',{text: 'Success'});
  socket.on('disconnect',function() {
    console.log('Web client disconnected');
  });
  socket.on('chat',function(message) {
    if(message.text == 'PING')
    {
      console.log('client : ' + message.text);
      socket.emit('chat', {text: 'PONG'});
      console.log('server : PONG')
    }
    if(message.text == 'PONG')
    {
      console.log('client : ' + message.text);
    }
  });
  setInterval(function(){
    console.log('server- : PING');
    socket.emit('chat', {text: 'PING'});
  }, Math.round(5000 + 5000 * Math.random()));
});

module.exports = app;
