/**
 * @module Pizza
 * @date 2013-11-11
 * @author Clotaire Delanchy <clotaire.delanchy@gmail.com>
 * @requires module:Database
 * @requires restify
 * @description
 *
 * Pizza
 */
'use strict';

var restify = require('restify');
var db = require('./database.js');


/**
 * @lends module:Pizza
 * @description
 * Pizza structure:
 * {
 * 		_id: ObjectId('5135cb7179396e0d61000001'),
 * 		name: 'Sublime Curry',
 *		content: 'Crème Fraîche, Mozarella, Tomates',
 *		picture: 'http://dominos.cdn.mediactive-network.net/site/media/img/cartes/pizzas/images/66_light.png',
 * 		warning: ['poisson', 'porc'],
 *		prix: 12
 * }
 */
var Pizza = module.exports = {

	/**
	 * Add a new pizza
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	add: function(req, res, next) {


	},

	/**
	 * Add new pizza from a tab filled with Pizzas.
	 * @param {Object} pizzas - 
	 * @param {Function} next - callback function
	 * @return none
	 */
	addFromTab: function(pizzas, next) {
		if(pizzas) {
			for(var i=0; i<pizzas.length; i++) {

				// check data integrity here

				// If data is ok, put it in the database
				console.log(pizzas[i]);
				db.insert('pizzas', pizzas[i], function(err, result) {
					//if (err) return next(err);
					//if (!result) return next( new restify.InternalError('cannot add') );
					//res.send( result );
					if(err) {
						console.error(err);
					}
					console.log('insertion ok');
					return next();
				});
			}
		} else {
			console.log('pas de pizzas à ajouter');
			return next();
		}
	},

	/**
	 * Edit an pizza by id
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	edit: function(req, res, next) {

	},

	/**
	 * Get an pizza by id
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	get: function(req, res, next) {

	},

	/**
	 * Delete an pizza by id
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	del: function(req, res, next) {

	},

	/**
	 * Search in the pizza collection
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	search: function(req, res, next) {

	},

	getAll: function(req, res, next) {

	},

	/**
	 * Check if the object ID string format
	 * @param {String} id
	 * @param {String} label - error message
	 * @return {Boolean}
	 */
	checkId: function(id, label) {
		return false;
	},

	/**
	 * Check the pizza structure
	 * @param {Object} pizza
	 * @param {Boolean} partial - checks a subset only
	 * @throws {restify.RestError}
	 * @return none
	 */
	checkData: function(pizza, partial) {
		return false;
	}
};