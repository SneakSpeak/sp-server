var PusherService = require("sails-service-pusher");

module.exports =
  PusherService('android', {
    device: [], // Array of string with device tokens
    provider: {
      apiKey: sails.config.GCMkey, // Your Google Server API Key
      maxSockets: 12, // Max number of sockets to have open at one time
      //proxy: 'http://your-proxy.com' // This is [just like passing a proxy on to request](https://github.com/request/request#proxies)
    },
    notification: {
      title: 'SneakSpeak Test Push', // Indicates notification title
      body: '', // Indicates notification body text
      icon: '', // Indicates notification icon
      sound: '', // Indicates sound to be played
      badge: '', // Indicates the badge on client app home icon
      payload: {} // Custom data to send within Push Notification
    }
   }
);
