/**
 * Discussion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "sp_discussion",
  attributes: {
    name: {
      type: "string",
      unique: true
    },
    isChannel: {
      type: "boolean",
      defaultsTo: false
    },
    participants: {
      collection: 'user',
      via: 'discussions',
      dominant: true
    }
  }
};

