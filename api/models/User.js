/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey: true
    },
    // password: {
    //   type: 'string',
    //   required: true
    // },
    token: {
      type: 'string',
      required: true,
      unique: true
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
        throw err;
      };
      cb();
    });
    //.exec(cb);
  },



  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • username    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {

    User.findOne({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  },

};
