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
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },


  /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • username {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  register: function (inputs, cb) {
    // Create a user
    User.create({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
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
    // Create a user
    User.findOne({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }
};
