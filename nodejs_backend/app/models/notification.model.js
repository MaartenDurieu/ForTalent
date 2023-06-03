const { INTEGER } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
      notificationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },
      activeAt: {
        type: Sequelize.DATE,
      },
      transactionID: {
        type: Sequelize.INTEGER,
      },
      listingID: {
        type: Sequelize.INTEGER,
      },
      reviewID: {
        type: Sequelize.INTEGER,
      },
      accountID: {
        type: Sequelize.INTEGER,
      }
    }, {
        timestamps: false,
        freezeTableName: true,
    });
    
    return Notification;
}
