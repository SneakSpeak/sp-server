var PusherService = require("sails-service-pusher");

module.exports = PusherService('android', {
  provider: {
    key: sails.config["GCMkey"],
    production: false
  }
});
