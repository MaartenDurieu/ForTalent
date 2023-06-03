module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      transactionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      suggestedPay: {
        type: Sequelize.DOUBLE
      },
      artistID: {
        type: Sequelize.INTEGER
      },
      venueID: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.TEXT
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      artistType: {
        type: Sequelize.STRING
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Transaction;
  };