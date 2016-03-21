// var gcm = require('node-gcm-ccs')(sails.config.push.gcm.projectNumber, sails.config.push.gcm.senderId);

// User.findOne(1).exec(function(err, user) {
//   if (err || !user) throw err;

//   gcm.send(user.token,
//   {
//     data: {
//       key1: 'message1',
//       key2: 'message2'
//     },
//     notification: {
//       title: "SneakSpeak Push Test",
//       icon: "ic_launcher",
//       body: "This is a XMPP test.",
//       sound: "default"
//     }
//   },null, function(err, messageId, to) {
//     if (err) console.log(err);
//     else {
//       console.log("Pushed to " + user.username + " (" + to + ")");
//     }
//   })
// })

module.exports = {

}
