/**
 * @file config.js
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @date 2013-09-30
 * 
 * Default configuration for Pizza Commander
 */
var join = require('path').join;
var config = {

	// Port to run server on
	port: 8080,

	// Web ressources root path(absolute)
	root: join(__dirname, '../www'),

	// Static contents max age
	maxAge: 3600 * 24,

	// Application domain
	domain: 'pizza.isati.org',
}

module.exports = config;