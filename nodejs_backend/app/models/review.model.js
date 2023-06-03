module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
      reviewID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      avgScore: {
        type: Sequelize.INTEGER,
      },
      writerID: {
        type: Sequelize.INTEGER,
      },
      receiverID: {
        type: Sequelize.INTEGER,
      },
      listingID: {
        type: Sequelize.INTEGER,
      },
      reviewText: {
        type: Sequelize.TEXT,
      },
      onTime: {
        type: Sequelize.INTEGER,
      },
      professionalism: {
        type: Sequelize.INTEGER,
      },
      friendly: {
        type: Sequelize.INTEGER,
      },
      collaboration: {
        type: Sequelize.INTEGER,
      },
      music: {
        type: Sequelize.INTEGER,
      },
      originality: {
        type: Sequelize.INTEGER,
      },
      audience: {
        type: Sequelize.INTEGER,
      },
      experience: {
        type: Sequelize.INTEGER,
      },
      atmosphere: {
        type: Sequelize.INTEGER,
      },
      accomodation: {
        type: Sequelize.INTEGER,
      },
      acoustics: {
        type: Sequelize.INTEGER,
      },
      organisation: {
        type: Sequelize.INTEGER,
      },
      helpful: {
        type: Sequelize.INTEGER,
      },    
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Review;
  };