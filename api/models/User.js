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
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
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

  register: function (inputs, cb) {
    console.log(JSON.stringify(inputs));
    // Create a user
    User.create({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password,
      token: inputs.token
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

    User.findOne({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  },

  /**
   * Send GCM push to the user.
   * @param  {Object}   inputs [description]
   *                           username {String}
   *                           message {String}
   * @param  {Function} cb
   */
  poke: function poke(inputs, cb) {
    User.findOne({username: inputs.username}).exec(function pokeUser(err, user){
      if(err) return cb(err);
      if(!user) return cb(null);

      var android = PusherService('android', {
        device: [user.device,], // Array of string with device tokens
        provider: {
          apiKey: sails.config.GCMkey, // Your Google Server API Key
          maxSockets: 12, // Max number of sockets to have open at one time
          //proxy: 'http://your-proxy.com' // This is [just like passing a proxy on to request](https://github.com/request/request#proxies)
        },
        notification: {
          title: 'SneakSpeak Test Push', // Indicates notification title
          body: inputs.message, // Indicates notification body text
          icon: '', // Indicates notification icon
          sound: '', // Indicates sound to be played
          badge: '', // Indicates the badge on client app home icon
          payload: {} // Custom data to send within Push Notification
        }
      });

      android
        .send()
        .then(console.log.bind(console))
        .catch(console.error.bind(console));
        cb(null, user);
    })
  },
};
