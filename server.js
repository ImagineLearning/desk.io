var logger = require('simple-node-logger').createSimpleLogger('desk.io.log');
var net = require('net');
var _ = require('underscore');
var deskService = require('./deskService');


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
	var secondsString = commandArray.shift();
	_(commands).chain().keys().contains(command).value() && commands[command].call(this, secondsString);
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

function onExitCommand(secondsString) {
	logger.info('EXIT');
	var idx = sockets.indexOf(this);
	if (idx != -1) {
		sockets[idx].destroy();
		delete sockets[idx];
	}
	if(!sockets.length) {
		logger.info('All clients disconnected.');
	}
}

function onUpCommand(secondsString) {
	logger.info('SENDING UP ' + secondsString);
	deskService.raiseDesk();
	sendStopAfter(secondsString);
}

function onDownCommand(secondsString) {
	logger.info('SENDING DOWN ' + secondsString);
	deskService.lowerDesk();
	sendStopAfter(secondsString);
}

function onStopCommand(secondsString) {
	logger.info('SENDING STOP ' + secondsString);
	deskService.stopDesk();
}

function sendStopAfter(secondsString) {
	if(secondsString) {
		var ms = parseInt(secondsString[0])*1000;
		if(isNaN(ms)) return;
		setTimeout(function() {
			logger.info('SENDING STOP after: ' + ms + '');
			deskService.stopDesk();
		}, ms);
	}
}

var svraddr = '0.0.0.0';
var svrport = 8000;

svr.listen(svrport, svraddr);
logger.info('Server Created at ' + svraddr + ':' + svrport + '\n');