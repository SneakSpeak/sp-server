/**
 * Discussion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "sp_channel",
  attributes: {
    name: {
      type: "string",
      unique: true
    },
    public: {
      type: "boolean",
      defaultsTo: true
    },
    participants: {
      collection: 'user',
      via: 'channels',
      dominant: true
    }
  }
};

