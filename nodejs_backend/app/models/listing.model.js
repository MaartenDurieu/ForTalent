module.exports = (sequelize, Sequelize) => {
    const Listing = sequelize.define("listing", {
      listingID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      date: {
        type: Sequelize.DATEONLY
      },
      startTime: {
        type: Sequelize.TIME
      },
      endTime: {
        type: Sequelize.TIME
      },
      suggestedPrice: {
        type: Sequelize.DOUBLE
      },
      location: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.TEXT
      },
      public: {
        type: Sequelize.INTEGER
      },
      artistType: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      listingPicture: {
        type: Sequelize.TEXT('long')
      },
      listingBanner: {
        type: Sequelize.TEXT('long')
      },
      artistID: {
        type: Sequelize.INTEGER
      }
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Listing;
  };