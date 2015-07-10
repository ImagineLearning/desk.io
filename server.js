var logger = require('simple-node-logger').createSimpleLogger('desk.io.log');
var net = require('net');
var _ = require('underscore');

var sockets = [];
var commands = {
	'up': onUpCommand,
	'down': onDownCommand,
	'stop': onStopCommand,
	'exit': onExitCommand
}

var svr = net.createServer(function(socket) {
	logger.info('Connected: ' + socket.remoteAddress + ':' + socket.remotePort); 
	socket.name = socket.remoteAddress + ':' + socket.remotePort;
	sockets.push(socket);

	socket.on('data', onSocketData);
	
	socket.on('end', onSocketEnd);
	
	socket.on('error', function(data) {
		logger.info('ERROR: ' + data);
	});
});

function onSocketData(data) {
	var commandString = data.toString('UTF-8').toLowerCase();
	
	var commandArray = commandString.split(/[ \t\r\n]/);
	// logger.info('processing command array: ' + commandArray.join(' '));
	var command = commandArray.shift();
	_(commands).chain().keys().contains(command).value() && commands[command].apply(this, commandArray);
}

function onSocketEnd() {
	var idx = sockets.indexOf(this);
	if (idx != -1) {
		delete sockets[idx];
	}
	logger.info('Disconnected: ' + this.name + '\n');
	if(!sockets.length) {
		logger.info('All clients disconnected.');
	}
}

function onExitCommand(args) {
	logger.info('EXIT');
	var idx = sockets.indexOf(this);
	if (idx != -1) {
		logger.info('destroyed');
		sockets[idx].destroy();
		delete sockets[idx];
	}
	if(!sockets.length) {
		logger.info('All clients disconnected.');
	}
}

function onUpCommand(args) {
	logger.info('SENDING UP ');
}

function onDownCommand(args) {
	logger.info('SENDING DOWN ');
}

function onStopCommand(args) {
	logger.info('SENDING STOP ');
}

var svraddr = '0.0.0.0';
var svrport = 8000;

svr.listen(svrport, svraddr);
logger.info('Server Created at ' + svraddr + ':' + svrport + '\n');