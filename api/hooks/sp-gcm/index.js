// index.js


var gcm = require('node-gcm-ccs')(sails.config.push.gcm.projectNumber, sails.config.push.gcm.senderId);
var helpers = require('./helpers');

var queue = {};
// Event listener for incoming messages
var message = gcm.on('message', function(messageId, from, category, data) {

    sails.log(Date.now().toString() + JSON.stringify({
      messageId: messageId,
      from: from,
      category: category,
      data: data
    }));
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
      helpers.transmitPrivateMessage(from, data.receiver, data.message, messageId);
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

gcm.on('connected', function(foo) {sails.log("GCM XMPP connected: " + foo)});
gcm.on('disconnected', function(foo) {sails.log("GCM XMPP disconnected: " + foo)});
gcm.on('online', function(foo) {sails.log("GCM XMPP online: " + foo)});
gcm.on('error', function(foo) {sails.log("GCM XMPP error: " + foo)});

module.exports = function spGcm(sails) {
  return helpers;
}
