module.exports = (sequelize, Sequelize) => {
    const Conversation = sequelize.define("conversation", {
      conversationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user1ID: {
        type: Sequelize.INTEGER
      },
      user2ID: {
        type: Sequelize.INTEGER
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Conversation;
  };