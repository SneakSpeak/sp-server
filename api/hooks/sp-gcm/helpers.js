var gcm = require('node-gcm-ccs')(sails.config.gcm.projectNumber, sails.config.gcm.apiKey);

var transmitPrivateMessage = function transmitPrivateMessage(senderToken, receiverName, message, messageId) {
  messageId = messageId || null;
  // Find the sending user
  User.findOne({where: {token: senderToken}}).exec(function(err, fromUser){

    // Handle error situations
    if(err || !fromUser) {
      sails.log("Problem with incoming XMPP message: " + (err ? err : "Token Not Found"));
      gcm.send(senderToken, {data: {err: "Token Not Found"}});
      return;
    }
   sendToUser(receiverName, fromUser.username, message, messageId);
  });
}

var sendToUser = function sendToUser(receiverName, title, message, messageId) {
  // Find the receiving user
  User.findOne(receiverName).exec(function(err, toUser){

    // Handle error situations
    if(err || !toUser) {
      sails.log("Problem with outgoing XMPP message: " + (err ? err : "Token Not Found"));
      return false;
    }

    gcm.send(toUser.token, {time_to_live: 0, data: {message: message, title: title}, notification: {title: title, text: message.substring(0,41)}}, {delivery_receipt_requested: false},
      function(err, messageId, to) {
        if(err) {
          sails.log(err);
          return false;
        }
        sails.log("Private message successfully sent (" + messageId + ")");
        return true;
      });
  });
}

//var sendToDiscussion(discussion, )


module.exports = {
  transmitPrivateMessage: transmitPrivateMessage,
  sendToUser: sendToUser
}
