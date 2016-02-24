module.exports = {
  send: function(req, res) {
    PusherService
      .send(['DEVICE_TOKEN_1', 'DEVICE_TOKEN_2'], {
        title: req.param('title') || 'Pusher',
        body: req.param('body') || 'Hello from sails-service-pusher'
      })
      .then(res.ok)
      .catch(res.negotiate);
  }
};
