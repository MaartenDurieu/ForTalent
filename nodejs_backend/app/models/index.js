const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    port: config.PORT,
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// load models
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.listing = require("../models/listing.model.js")(sequelize, Sequelize);
db.transaction = require("../models/transaction.model.js")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.notification = require("../models/notification.model.js")(sequelize, Sequelize);
db.review = require("../models/review.model.js")(sequelize, Sequelize);
db.following = require("../models/following.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.conversation = require("../models/conversation.model.js")(sequelize, Sequelize);

// add foreign keys
db.listing.belongsTo(db.user, {foreignKey: 'userID'})
db.transaction.belongsTo(db.listing, {foreignKey: 'listingID'})
db.transaction.belongsTo(db.user, {foreignKey: 'artistID'})
db.transaction.belongsTo(db.user, {foreignKey: 'venueID'})
db.notification.belongsTo(db.user, {foreignKey: 'userID'})
db.notification.belongsTo(db.transaction, {foreignKey: 'transactionID'})
db.review.belongsTo(db.user, {foreignKey: 'receiverID'})
db.review.belongsTo(db.user, {foreignKey: 'writerID'})
db.review.belongsTo(db.listing, {foreignKey: 'listingID'})
db.notification.belongsTo(db.listing, {foreignKey: 'listingID'})
db.notification.belongsTo(db.user, {foreignKey: 'accountID'})

module.exports = db;