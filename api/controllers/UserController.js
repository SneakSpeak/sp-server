var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   *
   */
  register: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.findOrCreate({
      username: req.param('username'),
      //password: req.param('password'),
      token: req.param('token')
    },{
      username: req.param('username'),
      //password: req.param('password'),
      token: req.param('token')
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      return res.redirect('/api/user/list?token=' + user.token);
    });
  },

  poke: function poke(req, res) {
    var useri = req.param("username");
    if(!useri) return res.badRequest({error: "Request must have username."});
    User.findOne({username: useri}, function(err, user) {
      if(err) return res.negotiate(err);
      if(!user) return res.notFound() && sails.log("404 User Not Found");

      sails.hooks["sp-gcm"].sendToUser(useri, "Testing", "Testing");
      res.ok();
    })
  },

  list: function list(req, res) {
    User.authUser(req, function(err, user) {
      if(err) return res.negotiate(err);
      if(!user) return res.notFound();
      // Find all users except the one asking the list
      User.find({
        where: {username: {"!": user.username} },
        select: ['username']

      }, function(err, users) {
        if(err) return res.negotiate(err);
        // Make array of usernames
        var userArray = users.map(function(a) {return a.username;});
        res.ok(JSON.stringify(userArray));
      });
    });
  },
  channels: function channels(req, res) {
    User.authUser(req, function(err, user) {
      User.findOne({username: user.username}).populate('channels')
        .exec(function (err, channels) {
          if(err) return res.negotiate(err);
          return res.json(channels.channels);
        });
    })

  },
  find: function find(req, res ) {

    var query = User.find()
      .where( actionUtil.parseCriteria(req))
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) );
      query = actionUtil.populateRequest(query, req);
      query.exec(function found(err, matchingRecords) {
        if (err) return res.serverError(err);

        var userArray = matchingRecords.map(function(a) {return a.username;});
        matchingRecords = userArray;
        // Only `.watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req._sails.hooks.pubsub && req.isSocket) {
          User.subscribe(req, matchingRecords);
          if (req.options.autoWatch) { User.watch(req); }
          // Also subscribe to instances of all associated models
          _.each(matchingRecords, function (record) {
            actionUtil.subscribeDeep(req, record);
          });
        }

        res.ok(matchingRecords);
      });
    },
    // Show the users info. Only accessible for the same user.
    // Doesn't show the password
    me: function(req, res) {
      User.authUser(req, function(err, user) {
        if(err) return res.negotiate(err);

        return (function(){
          var obj = user;
          return res.ok(user.me());
        })();
      })
    },
    // Send a message to user via GCM XMPP
    message: function(req, res) {
      User.authUser(req, function(err, user) {
        if(err) return res.negotiate(err);
        var receiverName = req.param('name');
        var message = req.param('message');
        if(!receiverName || !message) {
          return res.badRequest({error: "'name' and 'message' required."});
        }

        // Tell a white lie to the client
        res.ok();
        sails.hooks["sp-gcm"].sendToUser(receiverName, user.username, message);
      })
    }
};
