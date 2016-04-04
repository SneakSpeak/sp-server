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
};
