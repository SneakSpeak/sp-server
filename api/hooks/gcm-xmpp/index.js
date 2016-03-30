// index.js


var gcm = require('node-gcm-ccs')(sails.config.push.gcm.projectNumber, sails.config.push.gcm.senderId);

var queue = {};
// Event listener for incoming messages
var message = gcm.on('message', function(messageId, from, category, data) {

    sails.log(from + " : " + JSON.stringify(data,null,2));
    // ACK received message
    // gcm.send(from, {
    //     message_id: messageId,
    //     message_type: "ack"
    // });

    /**
     * Handle the upstream message
     */

    // 1-to-1 message
    if(data.receiver) {
      sails.log("*** 1-to-1 ***");
      // Find the sending user
      User.findOne({where: {token: from}}).exec(function(err, fromUser){

        // Handle error situations
        if(err || !fromUser) {
          sails.log("Problem with incoming XMPP message: " + (err ? err : "Token Not Found"));
          gcm.send(from, {data: {err: "Token Not Found"}});
          return;
        }
        // Find the receiving user
        User.findOne(data.receiver).exec(function(err, toUser){

          // Handle error situations
          if(err || !toUser) {
            sails.log("Problem with incoming XMPP message: " + (err ? err : "Token Not Found"));
            gcm.send(from, {data: {err: "Token Not Found", message_id: messageId}});
            return;
          }

          // toUser.sendGCM({data: {message: data.message}, notification: {title: fromUser.username, text: data.message.substring(0,20)}});
          gcm.send(toUser.token, {data: {message: data.message}, notification: {title: fromUser.username, text: data.message.substring(0,41)}}, {delivery_receipt_requested: true},
            function(err, messageId, to) {
              if(err) sails.log(err);
              sails.log(to + ":\n" + messageId);
            });
        });
      });
      return;
    }

    // Group chat or channel
    if(data.discussion) {

      return;
    }
    sails.log("Message was ignored :(");
});


var receipts = gcm.on('receipt', function(messageId, from, category, data){
  sails.log("Receipt: \n MessageID: " + messageId + "\nFrom: " + from + "\nCategory: " + category + "\nData:" + JSON.stringify(data));
  gcm.send(from, {
    message_id: messageId,
    message_type: 'ack'
  });
});

module.exports = function gcmXmppHook(sails) {
  return gcm;
}
