/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: "sp_user",
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey: true
    },
    password: {
      type: 'string',
      required: true,
      defaultsTo: 'loljoqpassu'
    },
    token: {
      type: 'string',
      required: true,
      unique: true
    },
    channels: {
      collection: 'channel',
      via: 'participants'
    },
    // For returning only a username string. It's also a security issue
    // to hide passwords and tokens with this overriden method.
    toJSON: function() {
      return this.username;
    },
    // Return user's information except for the password.
    me: function() {
      var me = Object.assign({}, this);
      delete me.password;
      return me;
    }
  },


  /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • username {String}
   *                     • password {String}
   *                     • token {String}
   * @param  {Function} cb
   */

  register: function register(inputs, cb) {
    console.log(JSON.stringify(inputs));
    // Create a user
    User.create({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password,
      token: inputs.token
    }, function(err, user) {
      if(err) {
        sails.log(err)
        return cb(err);
      };
      cb();
    });
    //.exec(cb);
  },


  authUser: function( req, cb ){
    if(!req.param("token")) {
      return cb({status: 401, error: "Unauthorized"});
    }

    // Check if the user exists
    User.findOne({
      where: {token: req.param("token")}
    }).populate('channels').exec( function (err, user){
        if(!user) return cb({status: 403, error: "Forbidden"}, null);
        return cb(err, user);
    });

  },



};
