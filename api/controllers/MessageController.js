/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
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

    if(!req.param("from") || !req.param("to") || !req.param("msg")) {
      return res.send(400, "from/to/msg Property Missing")
    }

    // Find the sender
    User.findOne({where: {
      username: req.param("from")}
    }, function (err, sender) {
      if (err) return res.negotiate(err);
      if(!sender) return res.send(404, "Sender Does Not Exist");

      // Find the receiver
      User.findOne({where: {
        username: req.param("to")
      }}, function (err, toUser) {
        if(err) return res.negotiate(err);
        if(!toUser) return res.send(404, "Receiver Does Not Exist");

        Message.create({
          to: toUser,
          from: sender,
          msg: req.param("msg")
        }, function(err, msg) {
          if (err) return res.negotiate(err);
          if (!msg) return res.send(500);

          sails.services.pushnotification.sendGCMNotification(toUser.token,
          {
            data: {
              key1: 'message1',
              key2: 'message2'
            },
            notification: {
              title: "SneakSpeak Push Test",
              icon: "ic_launcher",
              body: msg.msg,
              sound: "default"
            }
          }, true, function(err, results) {
            if(err) {
              return res.negotiate(err);
            }
            return res.send(200, results);
          });
        })
      })
    })
  }
};

