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

    gcm.send(toUser.token, {time_to_live: 0, data: {message: message, title: title}, notification: {title: title, text: message.substring(0,41)}}, {delivery_receipt_requested: true},
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
/**
 * [sendToChannel description]
 * @param  {Object} channel    [description]
 * @param  {String} senderName [description]
 * @param  {String} message    [description]
 */
var sendToChannel = function sendToChannel(channel, senderName, message) {
  console.log(channel.participants);
  // Send GCM message to channel participants
  channel.participants.forEach(function(user) {
    // Don't spam the sender
    if(user === senderName ) {
      return;
    }

    gcm.send(user.token,
      {
        time_to_live: 0,
        data: {
          channelID: channel.id,
          channelName: channel.name,
          message: message,
          title: senderName
        },
        notification: {
          title: channel.name,
          text: (senderName + ": " + message).substring(0,41)
        }
      }, {delivery_receipt_requested: true},
      function(err, messageId, to) {
        if(err) {
          sails.log(err);
          return false;
        }
        sails.log("Channel("+channel.name+") message successfully sent to "+user.username+" (" + messageId + ")");
        return true;
      }
    );
})
}


module.exports = {
  transmitPrivateMessage: transmitPrivateMessage,
  sendToUser: sendToUser,
  sendToChannel: sendToChannel
}
