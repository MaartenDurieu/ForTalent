const { authJwt } = require("../middleware");
const controller = require("../controllers/message.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post(
      "/api/sendMessage",
      controller.sendMessage
    );

    app.get(
      "/api/getLastMessagesConID",
      controller.getLastMessagesConID
    );

    app.get(
      "/api/getMostRecentMessage",
      controller.getMostRecentMessage
    )

    app.get(
      "/api/getMessages",
      controller.getMessages
    );
};