/**
 * @class Server
 * @date 2013-09-19
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @requires restify
 * @description
 *
 * HTTP server: provides file & REST services
 */
'use strict';

// Script requirements
// ********************
var restify = require('restify');
var path = require('path');
var join = path.join;
var Cookies = require('cookies');

var pkg = require('../package');

function Server(config) {
	var self = this;

	// Create server instance
	// ***********************
	var server = restify.createServer({
		name: pkg.name,
		version: pkg.version
	});

	// Set private vars
	// *****************
	this._server = server;
	this._config = config;

	// Restify plugins (middlewares)
	// ******************************
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.CORS({ origins: config.allowedOrigins }));
	server.use(restify.dateParser());
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser({ mapParams: false }));
	server.use(restify.conditionalRequest());

	// Redirections
	// *************
	server.pre(function redirect(req, res, next) {
		var location;
		switch (req.url) {
			/* redirects to portal index page */
			case '/':
			case '/portal':
			case '/portal/':
				res.header('Location', '/portal/index.html');
				res.send(302);
				self.log(req, res);
				return next(false); /* stop next tick */

			/* redirects to admin index page */
			case '/admin':
			case '/admin/':
				res.header('Location', '/admin/index.html');
				res.send(302);
				self.log(req, res);
				return next(false); /* stop next tick */

			/* do not redirect by default */
			default:
				return next();
		}
	});

	// Log the request
	// ****************
	server.on('after', self.log);

	// Portal static routes
	// *********************
	server.get(/^\/portal.*/, restify.serveStatic({
		directory: path.join(__dirname, '../public'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));

	// Admin static routes
	// ********************
	server.get(/^\/admin.*/, restify.serveStatic({
		directory: path.join(__dirname, '../public'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));

	/************************\
	*                        *
	*      Restfull API      *
	*                        *
	\************************/

	// Get API
	server.get('/api', function(req, res, next) {
		res.send( self.getAPI() );
		next(false);
	});

	// Get API version
	server.get('/api/version', function(req, res, next) {
		res.send( { version: pkg.version } );
		next(false);
	});

	// Authentification support
	server.post('/api/login', auth.login);
	server.post('/api/logout', auth.logout);
	server.get('/api/islogged', auth.islogged);

	// Operators
	server.put('/api/operator', operator.add);
	server.post('/api/operator/:id', operator.edit);
	server.del('/api/operator/:id', operator.del);
	server.get('/api/operator/:id', operator.get);
	server.get('/api/operator/card/:cardUID', operator.getByCardId);
	server.get('/api/search/operator', operator.search);
	server.get('/api/search/operator/:offset/:pg', operator.search);
}

/** 
 * Start the HTTP server listener
 * @return none
 */
Server.prototype.run = function() {
	var config = this._config;

	// Error handler
	this._server.on('error', function onError(e) {
		switch (e.code) {
			case 'EADDRINUSE':
				tools.error('port', config.port, 'already in use');
				return process.exit(1);

			case 'EACCES':
				tools.error('not allowed to bind port', config.port);
				return process.exit(1);

			default:
				tools.error(e.code);
				return process.exit(1);
		}
	});

	// Start listening
	this._server.listen(config.port, function() {
		tools.notice('HTTP Server bound to port', config.port);
	});
};

/**
 * Log the current request / reponse.
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @return none
 */
Server.prototype.log = function(req, res) {
	var ipAddress = req.headers['x-forwarded-for'] === undefined ? req.connection.remoteAddress : req.headers['x-forwarded-for'];
	var responseTime = (res._headers && res._headers.hasOwnProperty('x-response-time') ? res._headers['x-response-time']+'ms' : '');
	tools.notice(ipAddress + ' ' + req.method + ' ' + req.url + ' ' + res.statusCode + ' ' + responseTime);
};

/**
 * Get the REST server API
 * @return {Object} API ordered by HTTP Method
 */
Server.prototype.getAPI = function() {
	if (!this._API) {
		var API, routes, route, mtd, i;
		API = {};
		routes = this._server.router.routes;
		for (mtd in routes) {
			API[mtd] = [];
			for (i in routes[mtd]) {
				route = routes[mtd][i];
				// Filter static routes
				if (!route.spec.path.match(/^\/api/)) continue;

				// Push to the API private obj
				API[mtd].push({
					method: route.spec.method,
					path: route.spec.path,
					versions: route.spec.versions
				});
			}
		}
		this._API = API;
	}
	return this._API;
};

// Export it
module.exports = Server;
