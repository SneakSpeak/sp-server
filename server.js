#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');

var models = require("./models/index");

/**
 * Get port from environment and store in Express.
 */
var port = process.env.PORT || 3000;
app.set('port', port);


/**
 * Listen on provided port, on all network interfaces.
 */

models.sequelize.sync().then(function () {
  app.listen(app.get("port"), function() {
    console.log("Hello... Listening on "+ app.get('port'));
  })
});

