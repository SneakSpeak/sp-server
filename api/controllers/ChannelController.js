var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
/**
 * ChannelController
 *
 * @description :: Server-side logic for managing Channels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function find(req, res ) {

    var query = Channel.find()
      .where( actionUtil.parseCriteria(req) )
      .where( {public: true})
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) );
      query = actionUtil.populateRequest(query, req);
      query.exec(function found(err, matchingRecords) {
        if (err) return res.serverError(err);

        // Only `.watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req._sails.hooks.pubsub && req.isSocket) {
          Channel.subscribe(req, matchingRecords);
          if (req.options.autoWatch) { Channel.watch(req); }
          // Also subscribe to instances of all associated models
          _.each(matchingRecords, function (record) {
            actionUtil.subscribeDeep(req, record);
          });
        }

        res.ok(matchingRecords);
      });
    },
    findOne: function findOne(req, res ) {

      var pk = actionUtil.requirePk(req);

        var query = Channel.findOne(pk);
        query = actionUtil.populateRequest(query, req);
        query.exec(function Channel(err, matchingRecord) {
          if (err) return res.serverError(err);
          if(!matchingRecord) return res.notFound('No record found with the specified `id`.');
          if(!matchingRecord.public) {
            User.authUser(req, function(err, user) {
              if(err) return res.negotiate(err);
              if(!user) return res.notFound();

              //user.populate('channels');

              var isParticipant = user.channels.find(function (d) {
                sails.log(d);
                return d.id === matchingRecord.id;
              });

              if(!isParticipant) {
                return res.json(403, {error: "Acces Denied"});
              }
              return res.ok(matchingRecord);
            })
          } else {
            return res.ok(matchingRecord);
          }
          if (req._sails.hooks.pubsub && req.isSocket) {
            Channel.subscribe(req, matchingRecord);
            actionUtil.subscribeDeep(req, matchingRecord);
          }

          //return res.ok(matchingRecord);
        });
    },
    join: function joinChannel(req, res) {
      User.authUser(req, function(err, user) {
        if (err) return res.negotiate(err);

        Channel.findOne(req.param("channelID"))
          //.where({isChannel: true})
          .populate('participants')
          .exec(function joinChannel(err, channel) {
            if(err) return res.negotiate(err);
            if(!channel) return res.notFound("Channel Not Found");

            user.channels.add(channel);
            user.save(function(err, u) {
              if(err) return res.negotiate(err);

              Channel.findOne(channel.id).populate('participants')
                .exec(function response(err, c) {
                  return res.ok(c);
                })
            });
            // return res.json(channel);
          })
      })
    },
    create: function(req, res) {
      User.authUser(req, function(err, user) {
        if(err) return res.negotiate(err);

        Channel.create({
          name: req.param("name"),
          public: req.param("public") ? req.param("public") : true,
        }).exec(function createdChannel(err, channel) {
          if(err) return res.negotiate(err)

          user.channels.add(channel);
          user.save();
          return res.json(channel);
        })
      });
    },
    // Send a message to the channel via GCM XMPP
    message: function(req, res) {
      User.authUser(req, function(err, user) {
        if(err) return res.negotiate(err);
        var channelID = req.param('channelID');
        var message = req.param('message');
        if(!channelID || !message) {
          sails.log(req);
          return res.badRequest({error: "'channelID' and 'message' required."});
        }

        Channel.findOne(channelID).populate('participants')
          .exec(function (err, channel) {
            if(err) return res.negotiate(err);
            if(!channel) return res.notFound();

            sails.hooks["sp-gcm"].sendToChannel(channel, user.username, message);
            return res.ok();
          })


      })
    },
    joinOrCreate: function joinOrCreate(req, res){
      // Authenticate
      User.authUser(req, function(err, user) {
        // Handle authentication errors
        if(err) return res.negotiate(err);

        // Find or create channel with the name
        Channel.findOrCreate(
          {
            name: req.param("name"),
            public: req.param("public")
          })
          .limit(1)
          .exec(function( err, channel) {
            if(err) return res.negotiate(err);

            // Join the channel
            user.channels.add(channel);
            user.save(function(err, u) {
              if(err) return res.negotiate(err);

              // Get and return the channel with the new join
              Channel.findOne(channel.id).populate('participants')
                .exec(function response(err, c) {
                  return res.ok(c);
                });
              });
            });
      });
    },
};
