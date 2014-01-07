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
var sys = require('sys');
var htmlparser = require('htmlparser2');
var select = require('soupselect').select;

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
		directory: path.join(__dirname, '../www'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));

	// Admin static routes
	// ********************
	server.get(/^\/admin.*/, restify.serveStatic({
		directory: path.join(__dirname, '../www'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));

	// ======== TEST DU PARSING =========

	var http = require('http');
	var host = "ks3323119.kimsufi.com"
	var client = http.createClient(80, host);
	var request = client.request('GET', '/', {'host': host});

	request.on('response', function(response) {
	    response.setEncoding('utf8');

	    var body = "";
	    response.on('data', function (chunk) {
	        body = body + chunk;
	        //console.log(body);
	    });

	    response.on('end', function() {

	        // now we have the whole body, parse it and select the nodes we want...
	        var handler = new htmlparser.DefaultHandler(function(err, dom) {
	            if (err) {
	                sys.debug("Error: " + err);
	            } else {

	                // soupselect happening here...
	                var titles = select(dom, '.post-title');
	                //console.log(titles);
	                //sys.puts("Top articles from my blog");
	            	//console.log(JSON.stringify(titles));
	                titles.forEach(function(title) {
	                    //sys.puts("- " + title.children[0].raw + " [" + title.attribs.href + "]\n");
	                    console.log(title.children[0].children[0].data);
	                });
	            }
	        });

	        var parser = new htmlparser.Parser(handler);
	        parser.parseComplete(body);
		});
	});
	request.end();





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
				console.error('port ' + config.port + ' already in use');
				return process.exit(1);

			case 'EACCES':
				console.error('not allowed to bind port ' + config.port);
				return process.exit(1);

			default:
				console.error(e.code);
				return process.exit(1);
		}
	});

	// Start listening
	this._server.listen(config.port, function() {
		console.info('HTTP Server bound to port ' +  config.port);
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
	console.log(ipAddress + ' ' + req.method + ' ' + req.url + ' ' + res.statusCode + ' ' + responseTime);
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
