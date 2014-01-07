/**
 * @module Parser
 * @date 2013-12-28
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @requires htmlparser2
 * @requires soupselect
 * @requires http
 * @description
 *
 * This module is an HTML parser, which will get the image and names of all the
 * Domino's pizzas from the company website.
 */
'use strict';

// Some requirements
var htmlparser = require('htmlparser');
var select = require('soupselect');
var http = require('http');

var host = "www.reddit.com"
var client = http.createClient(80, host);
var request = client.request('GET', '/', {'host': host});

request.on('response',) {
    response.setEncoding('utf8');

    var body = "";
    response.on('data', function (chunk) {
        body = body + chunk;
    });

    response.on('end', function() {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                sys.debug("Error: " + err);
            } else {

                // soupselect happening here...
                var titles = select(dom, 'a.title');

                sys.puts("Top stories from reddit");
                titles.forEach(function(title) {
                    sys.puts("- " + title.children[0].raw + " [" + title.attribs.href + "]\n");
                })
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
};
request.end();

var Parser = module.exports = {

	// Attributes
	var parser = new htmlparser.Parser({
		onopentag: function(name, attribs) {
			if(name == "li" && atribs.class == "produit") {
				return true;
			} else {
				return false;
			}
		};

		ontext: function(text) {
		};

	});

	// Methods



};