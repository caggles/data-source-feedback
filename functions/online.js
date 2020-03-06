'use strict';
const got = require('got');
const publicIp = require('public-ip');
const pAny = require('p-any');
const pTimeout = require('p-timeout');

module.exports = async function isOnline() {
	await publicIp['v4']();
	return true;
};
