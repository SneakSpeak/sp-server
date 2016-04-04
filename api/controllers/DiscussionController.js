var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
/**
 * DiscussionController
 *
 * @description :: Server-side logic for managing Discussions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function find(req, res ) {

    var query = Discussion.find()
      .where( actionUtil.parseCriteria(req) )
      .where( {isChannel: true})
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) );
      query = actionUtil.populateRequest(query, req);
      query.exec(function found(err, matchingRecords) {
        if (err) return res.serverError(err);

        // Only `.watch()` for new instances of the model if
        // `autoWatch` is enabled.
        if (req._sails.hooks.pubsub && req.isSocket) {
          Discussion.subscribe(req, matchingRecords);
          if (req.options.autoWatch) { Discussion.watch(req); }
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

        var query = Discussion.findOne(pk);
        query = actionUtil.populateRequest(query, req);
        query.exec(function Discussion(err, matchingRecord) {
          if (err) return res.serverError(err);
          if(!matchingRecord) return res.notFound('No record found with the specified `id`.');
          if(!matchingRecord.isChannel) {
            User.authUser(req, function(err, user) {
              if(err) return res.negotiate(err);
              if(!user) return res.notFound();

              //user.populate('discussions');

              var isParticipant = user.discussions.find(function (d) {
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
            Discussion.subscribe(req, matchingRecord);
            actionUtil.subscribeDeep(req, matchingRecord);
          }

          //return res.ok(matchingRecord);
        });
    },
};
