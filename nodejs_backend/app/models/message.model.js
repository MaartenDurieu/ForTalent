module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
      messageID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      senderID: {
        type: Sequelize.INTEGER
      },
      receiverID: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      conversationID: {
        type: Sequelize.INTEGER
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Message;
  };