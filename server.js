// Startup Express App
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(process.env.PORT || 8080);

// Configure Redis client connection
var redis = require('redis');
var credentials;
// Check if we are in BlueMix or localhost
if(process.env.VCAP_SERVICES) {
  // On BlueMix read connection settings from
  // VCAP_SERVICES environment variable
  var env = JSON.parse(process.env.VCAP_SERVICES);
  credentials = env['redis-2.6'][0]['credentials'];
} else {
  // On localhost just hardcode the connection details
  credentials = { "host": "127.0.0.1", "port": 6379 }
}
// Connect to Redis
var redisClient;

var connectToRedis = function() {
  redisClient = redis.createClient(credentials.port, credentials.host);
  if('password' in credentials) {
    // On BlueMix we need to authenticate against Redis
    redisClient.auth(credentials.password);
  }
};
connectToRedis();

// There's an issue with the Redis client for Node where it
// will time out every so often and hang the client browser
// This code gets around this issue by reconnecting on timeout
var refreshRedis = function() {
  var replaceClient = function() {
    redisClient.closing = true;
    redisClient.end();

    connectToRedis();
    refreshRedis();
  };

  redisClient.once("end", function() {
    replaceClient();
  });
};
refreshRedis();

// Configure Jade template engine
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// handle HTTP GET request to the "/" URL FOR INDEX
app.get('/', function(req, res) {
  // Get the 10 most recent messages from Redis
  var messages = redisClient.lrange('messages', 0, 10, function(err, reply) {
    if(!err) {
      var result = [];
      // Loop through the list, parsing each item into an object
      for(var msg in reply) result.push(JSON.parse(reply[msg]));
      // Pass the message list to the view
      res.render('index', { messages: result });
    } else res.render('index');
  });
});

// FOR ADMIN PAGE
app.get('/admin', function(req, res) {
  // Get the 10 most recent messages from Redis
  var messages = redisClient.lrange('messages', 0, 10, function(err, reply) {
    if(!err) {
      var result = [];
      // Loop through the list, parsing each item into an object
      for(var msg in reply) result.push(JSON.parse(reply[msg]));
      // Pass the message list to the view
      res.render('admin', { messages: result });
    } else res.render('admin');
  });
});

// socket.io listen for messages
io.on('connection', function(socket) {
  // When a message is received, broadcast it
  // to all users except the originating client
  socket.on('msg', function(data) {
    redisClient.lpush('messages', JSON.stringify(data));
    redisClient.ltrim('messages', 0, 10);
    socket.broadcast.emit('msg', data);
  });
});
