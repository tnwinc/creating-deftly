#! /usr/bin/env node
'use strict';

var exec = require('child_process').exec;

var Promise = function() {

	/// ************************************************************************
    /// Constructor Safe Check
    /// ************************************************************************
    if ( !( this instanceof Promise ) ) return new Promise();

    /// ************************************************************************
    /// Public Properties
    /// ************************************************************************
    this.status = 'PENDING';
	this.resolvedWith = null;
	this.rejectedWith = null;

	/// ************************************************************************
    /// Private Properties
    /// ************************************************************************
    var _onThen = function() {};
    var _onRejected = function() {};
    var _onFinally = function() {};

	/// ************************************************************************
    /// Private Methods
    /// ************************************************************************
    // var myPrivateMethod = function() {};


    /// ************************************************************************
    /// Privileged Methods
    /// ************************************************************************
    this.then = function(func) {
		_onThen = func;
		return this;
	};
	this.onRejected = function(func) {
		_onRejected = func;
		return this;
	};
	this.finally = function(func) {
		_onFinally = func;
		return this;
	};
	this.resolveWith = function(value) {
		this.resolvedWith = value;
		this.status = 'RESOLVED';
		_onThen(value);
		return _onFinally(value);
	};
	this.rejectWith = function(value) {
		this.rejectedWith = value;
		this.status = 'REJECTED';
		_onRejected(value);
		return _onFinally(value);
	};
};


module.exports = function(command) {
	var promise = new Promise();

	exec(command, function(err, stdout, stderr) { //child_process is async
		if (err || stderr) promise.rejectWith(err || stderr);
		else promise.resolveWith(stdout);
	});

	return promise;
};
