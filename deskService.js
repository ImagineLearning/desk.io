// var io = require('pi-gpio');
var logger = require('simple-node-logger').createSimpleLogger('desk.io.log');

exports.stopDesk = function() {
	logger.info('deskService stop');
};

exports.raiseDesk = function() {
	logger.info('deskService raise');
};

exports.lowerDesk = function() {
	logger.info('deskService lower');
};
