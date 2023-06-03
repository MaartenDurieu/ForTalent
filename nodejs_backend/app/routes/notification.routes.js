const { authJwt } = require("../middleware");
const controller = require("../controllers/notification.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post(
      "/api/writeNotification",
      controller.postNotification
    );

    app.get(
      "/api/notificationsMergedALL",
      [authJwt.verifyToken],
      controller.getUserNotificationsMergedALL
    );
    app.get(
      "/api/notificationsMerged",
      [authJwt.verifyToken],
      controller.getUserNotificationsMerged
    );
    
    app.get(
      "/api/notifications",
      [authJwt.verifyToken],
      controller.getUserNotifications
    );
    app.post(
      "/api/cancelNotification",
      controller.NotificationsCancel
    );
    app.post(
      "/api/removeNotification",
      controller.NotificationsRemove
    );
    app.get(
      "/api/notification/markViewed",
      [authJwt.verifyToken],
      controller.markNotificationAsViewed
    );
  };