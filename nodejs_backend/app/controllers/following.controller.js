const db = require("../models");
const Notification = db.notification;
const Transaction = db.transaction;
const { following } = require("../models");
const Listing = db.listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;
const Following = db.following;


exports.followAccount = (req, res) => {
    Following.create({
        userID: req.body.userID,
        followerID: req.body.followerID
    }).then(l => {
        res.send({ message: "Follower link was created successfully!",followingID:l.followingID});
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}
