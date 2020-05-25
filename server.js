#!/usr/bin/env node
/**
 * application entry
 */
/**
 * loaders
 */
global.appRootPath = require('app-root-path');
global.colors = require('colors/safe');

const fs = require('fs');
const packagejson = require('./package.json');
const createDirectory = require('./tools/shared').createDirectory
//require('events').EventEmitter.defaultMaxListeners = 100 //increase number of listeners to avoid warning of memory leak and server restart
const notSeenNotifications = require(`${appRootPath}/tools/notifications`).notSeenNotifications
//const NumClientsInRoom = require(`${appRootPath}/utils/tools`).NumClientsInRoom


const appStartedAt = Date(Date.now());
exports.appStartedAt = appStartedAt;
const ip = require("ip");
exports.ip = ip.address()
const prefs = require(`${appRootPath}/config/prefs`); //should be after exporting ip
let port = prefs.backPort
exports.port = port;

//setting http or https
if (prefs.httpMode == 'https') {
  //create HTTPS server
  var app = require('../app');
  app.set('port', port);
  var https = require('https');
  var httpsOptions = {
    key: fs.readFileSync(`${appRootPath}/ssl/_.abc.com_private_key.key`),
    cert: fs.readFileSync(`${appRootPath}/ssl/abc.com_ssl_certificate.cer`)
  };
  var server = https.createServer(httpsOptions, app);
} else {
  //create HTTP server
  var app = require('./app');
  app.set('port', port);
  var http = require('http');
  var server = http.createServer(app);
}

var debug = require('debug')(`${packagejson.name}:server`);


//making sure these directories are created to prevent app crash
createDirectory('logs')
createDirectory('uploads')
createDirectory('uploads/games')

/**
 * running the server
 */
if (prefs.cluster != 0) {
  let cluster = require('cluster');
  let cpusCount = require('os').cpus().length
  if (prefs.cluster == 'all') {
    prefs.cluster = cpusCount
  } else if (prefs.cluster == 'half') {
    prefs.cluster = cpusCount / 2
  }

  // make sure process number doesnt exceed cpus number
  if (prefs.cluster > cpusCount) {
    prefs.cluster = cpusCount
  }

  if (cluster.isMaster) {
    log().verbose({ message: `cluster is enbaled. ${prefs.cluster} cpus are in use` })
    // Create a worker for each CPU
    for (let i = 1; i <= prefs.cluster; i++) {
      // log().verbose({ message: `forking cluster ${i}` })
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function () {
      log().verbose({ message: `cluster exited` })
      cluster.fork();
    });

  } else {
    //launching the server
    server.listen(port, log().verbose(colors.blue(`******** ${packagejson.name} ${packagejson.version} ${prefs.httpMode}://${ip.address()}:${port}/ NODE_ENV=${process.env.NODE_ENV} cluster is enabled, fork ${cluster.worker.id} pid ${cluster.worker.process.pid} ********`)));
    server.on('error', onError);
    server.on('listening', onListening);
  }
} else {
  //launching the server without cluster
  server.listen(port, log().verbose(colors.blue(`******** ${packagejson.name} ${packagejson.version} ${prefs.httpMode}://${ip.address()}:${port}/ NODE_ENV=${process.env.NODE_ENV} cluster is disabled ********`)));
  server.on('error', onError);
  server.on('listening', onListening);
}

/**
 * socketio
 */
if (prefs.socketio.enable == true) {
  global.io = require("socket.io")(server);
  const privateKey = require(`${appRootPath}/config/secrets`).privateKey;
  var jwt = require('jsonwebtoken');
  let user = {} // user from token

  io.sockets
    //socket middleware to verify token
    .use(function (socket, next) {
      // connect to socket only if a token is provided
      if (socket.request._query.token) {
        return jwt.verify(socket.request._query.token, privateKey, function (err, decoded) {
          if (err) {
            return log().warn({ message: err, route: '[/bin/www/socket]' });
          }
          next()
          user = decoded.user
        })
      }
    })
    // socket connected
    .on("connection", socket => {
      //log().verbose(`[SOCKET_CONN] : ${socket.id} socketClients ${socket.nsp.server.eio.clientsCount}`);
      socket.join(`${user.userName}`, () => {
        log().verbose(`${user.userName} connected with socket.id=${socket.id}`);
      });
      //global.io.sockets.emit('from_server', { socketClients: socketClients });
      //usersThisMonth++;
      global.io.sockets.emit('info', {
        clientsCount: socket.nsp.server.eio.clientsCount,
        usersThisMonth: 5//usersThisMonth
      });



      socket.on('disconnect', (reason) => {
        // socketClients--;
        global.io.sockets.emit('info', {
          clientsCount: socket.nsp.server.eio.clientsCount,
          usersThisMonth: 5//usersThisMonth
        });
        //console.log('[disconnect] : ' + socket.id + ' socketClients ' + socket.nsp.server.eio.clientsCount);
      })

      socket.on('error', (error) => {
        console.log('[ERROR] : ' + socket.id + ' ' + error);
      });

      socket.on('disconnecting', (reason) => {
        //console.log('[disconnecting] : ' + socket.id + ' ' + reason);
      });


      //listen on new_message
      socket.on('broadcast_message', (data) => {
        //broadcast the new message
        //io.sockets.emit('message', { message: data.message, from: socket.id });
        io.sockets.emit('message', data);

      })
      socket.on('message', (data) => {
        //broadcast the new message
        //io.sockets.emit('message', { message: data.message, from: socket.id });
        io.sockets.emit('message', { data });
        if (data.to == 'all') {
          io.sockets.emit('message', { from: data.from, to: data.to, message: data.message });

        } else {
          io.sockets.to(data.to).emit('message', { message: data.message, from: socket.id });

        }

      })

      //listen on typing
      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', socket.id)
      })

      socket.on('private_message', (data) => {
        console.log('to: ' + data.to);
        io.sockets.to(data.to).emit('message', { message: data.message, from: socket.id });
      })

      //end new


    })
}








/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port == 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use, change the port in config/prefs.backPort');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr == 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

