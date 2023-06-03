module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.STRING,
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
  
    return Category;
  };