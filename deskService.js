// var io = require('pi-gpio');
var logger = require('simple-node-logger').createSimpleLogger('desk.io.log');
var exec = require('child_process').exec;

exports.stopDesk = function() {
	logger.info('deskService stop');
	exec('python ./servostop.py', function(error, stdout, stderr){

	});
};

exports.raiseDesk = function() {
	logger.info('deskService raise');
	exec('python ./servoup.py', function(error, stdout, stderr){

	});
};

exports.lowerDesk = function() {
	logger.info('deskService lower');
	exec('python ./servodown.py', function(error, stdout, stderr){

	});
};
