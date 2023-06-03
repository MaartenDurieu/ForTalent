module.exports = (sequelize, Sequelize) => {
    const Following = sequelize.define("following", {
      followingID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userID: {
        type: Sequelize.INTEGER
      },
      followerID: {
        type: Sequelize.INTEGER
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Following;
  };