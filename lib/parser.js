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
var http = require('http');
var select = require('soupselect').select;
var htmlparser = require('htmlparser2');

function Parser(host, port, page) {
    var self = this;

    // Initialization of members
    this._host = host;
    this._port = port;
    this._page = page;
    this.pizzas = [];
};

Parser.prototype.parse = function() {

    var self = this;
    var client = http.createClient(this._port, this._host);
    var request = client.request('GET', this._page, {'host' : this._host});


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
                    console.log("Error: " + err);
                } else {

                    // soupselect happening here...
                    var divNames = select(dom, 'h2');
                    var divContent = select(dom, 'div.infos p');

                    for(var i=0; i<divNames.length; i++) {
                        var pizza = {};
                        pizza.name = divNames[i].children[0].data;
                        pizza.content = divContent[i].children[0].data;

                        //console.log(pizza);
                        //self.pizzas.push(pizza);
                        self.addPizza(pizza);
                    }

                    console.log(self.pizzas);
                }
            });

            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(body);
        });
    });

    request.end();
};

Parser.prototype.addPizza = function(piz) {
    var self = this;
    self.pizzas.push(piz);
};

module.exports = Parser;