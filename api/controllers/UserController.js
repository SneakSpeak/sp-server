/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  /**
   * `UserController.login()`
   */
  login: function (req, res) {

    // See `api/responses/login.js`
    return res.login({
      username: req.param('username'),
      //password: req.param('password'),
      successRedirect: '/',
      invalidRedirect: '/login'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
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

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.redirect('/api/user/list?username=' + user.username);
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/welcome');
    });
  },


  // poke: function poke(req, res) {
  //   var useri = "meitsi";
  //   User.findOne({
  //     username: useri,
  //   }, function(err, user) {
  //     if (err) return res.negotiate(err);
  //     if(!user) return res.send(404,"User Not Found");
  //     sails.log("Pushing...");
  //     sails.log("Token: [" + user.token + "]");
  //     sails.log("Server API key: " + sails.config.GCMkey);
  //     PusherService
  //       .send([user.token], {
  //         body: "Hello world!"
  //       })
  //       /*
  //       .then(function(response) {sails.log("Push OK: " + JSON.stringify(response)); res.ok("Push sent!");})
  //       .catch(function(err) {sails.log("Push FAILED: " + err); return res.negotiate();});
  //       */
  //      .then(console.log.bind(console))
  //      .catch(console.error.bind(console));
  //   })
  // },

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
        where: {username: {"!": req.param("username")} },
        select: ['username']

      }, function(err, users) {
        if(err) return res.negotiate(err);
        // Make array of usernames
        var userArray = users.map(function(a) {return a.username;});
        res.ok(JSON.stringify(userArray));
      });
    });
  },
  discussions: function discussions(req, res) {
    User.authUser(req, function(err, user) {
      User.findOne({username: user.username}).populate('discussions')
        .exec(function (err, discussions) {
          if(err) return res.negotiate(err);
          return res.json(discussions);
        });
    })

  }
};
