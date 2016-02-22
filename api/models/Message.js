/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    // Sender
    from: {
      model: 'user',
      required: true
    },
    // Receiver
    to: {
      model: 'user',
      required: true
    },
    msg: {
      type: 'text',
      required: true
    }


  }
};

