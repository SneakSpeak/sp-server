/**
 * ChannelMessageController
 *
 * @description :: Server-side logic for managing Channelmessages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	  /**
     * [send description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    send: function send(req, res) {

      if(!req.param("from") || !req.param("channel") || !req.param("msg")) {
        return res.send(400, "from/channel/msg Property Missing")
      }

      // Find the sender
      User.findOne({where: {
        username: req.param("from")}
      }, function (err, sender) {
        if (err) return res.negotiate(err);
        if(!sender) return res.send(404, "Sender Does Not Exist");

        // Find the receiver
        Channel.findOne({where: {
          name: req.param("channel")
        }}).populate("participants").exec(function (err, channel) {
          if(err) return res.negotiate(err);
          if(!channel) return res.send(404, "Channel Does Not Exist");

          ChannelMessage.create({
            channel: channel,
            from: sender,
            msg: req.param("msg")
          }, function(err, msg) {
            if (err) return res.negotiate(err);
            if (!msg) return res.send(500);

            sails.log(channel.participants);
            var tokens = channel.participants.map(function(a) {return a.token;});
            //var tokens = channel.participants.token;
            sails.log("Tokens: \n" + JSON.stringify(tokens, null, 2));

            sails.services.pushnotification.sendGCMNotification(tokens,
            {
              data: {
                key1: 'message1',
                key2: 'message2'
              },
              notification: {
                title: channel.name,
                icon: "ic_launcher",
                body: sender.username + ": " + msg.msg,
                sound: "default"
              }
            }, true, function(err, results) {
              sails.log("tried to push to " + channel.name + " participants...");
              if(err) {
                return res.negotiate(err);
              }
              return res.send(200, results);
            });
          })
        })
      })
    },
};

