/**
 * Channel.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'text',
      unique: true,
      required: true
    }

  }


  /**
   * Subscribes a user to a channel
   * @param  {Object}   inputs
   *           => channelID {Integer} ID of the channel to subscribe
   *           => userID {Integer} ID of the subscribing user
   * @param  {Function} cb     [description]
   * @return {[type]}          [description]
   */
/*  subscribe: function (inputs, cb) {
    // Create a user
    Channel.findOne(inputs.channelID).exec(function(err, theChannel) {
      if(err) return cb(err);
      if(!theChannel) return cb(new Error("Channel not found."));
      User.findOne(inputs.userID).exec(function(err, theUser) {
        if(err) return cb(err);
        if()
      })



      theChannel.users.add(inputs.userId);
      theChanlle.save(cb);
    })
  }*/
};

