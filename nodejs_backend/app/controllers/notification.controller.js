const db = require("../models");
const Notification = db.notification;
const Transaction = db.transaction;
const Listing = db.listing;
const User = db.user;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;


exports.NotificationsRemove = (req,res) => {
    Notification.findAll({
        where: {
            [Op.not]: [{type: req.body.type}],
            listingID: req.body.listingID 
        }
    }).then(trs => {
        let remainingDeletions = trs.length;
        trs.forEach(x => {
            x.destroy().then(_ => {
                remainingDeletions -= 1;
            })
        })
    })
}

exports.NotificationsCancel = (req,res) => {
    Notification.findAll({
        where: {
            [Op.or]: [{userID: req.body.artistID},{userID: req.body.venueID}],
            listingID: req.body.listingID 
        }
    }).then(trs => {
        let remainingDeletions = trs.length;
        trs.forEach(x => {
            x.destroy().then(_ => {
                remainingDeletions -= 1;
            })
        })
    })
}

exports.getUserNotificationsMergedALL = (req, res) => {
    Notification.findAll({
        where: {
            userID: req.userId,
            // check if notification is only active from certain date
            /*activeAt: {
              [Op.or]: {
                [Op.not]: sequelize.literal('NOW()'),
                [Op.is]: null
              }   
            }*/

        },
        include: [{
            model: Listing},
            {model: User,
        }]
        // include customerID, listingID and listing name
        //include: {model: Transaction, attributes: ['listingID', 'customerID'], include: {model: Listing, attributes: ['name']}},
    }).then(n => {
        res.status(200).send({notifications: n})
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};
exports.getUserNotificationsMerged = (req, res) => {
    Notification.findAll({
        where: {
            userID: req.userId,
            // check if notification is only active from certain date
            /*activeAt: {
              [Op.or]: {
                [Op.not]: sequelize.literal('NOW()'),
                [Op.is]: null
              }   
            }*/

        },
        include: {
            model: Listing,
        }
        // include customerID, listingID and listing name
        //include: {model: Transaction, attributes: ['listingID', 'customerID'], include: {model: Listing, attributes: ['name']}},
    }).then(n => {
        res.status(200).send({notifications: n})
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};
// get all notifications from user
exports.getUserNotifications = (req, res) => {
    Notification.findAll({
        where: {
            userID: req.userId,
            // check if notification is only active from certain date
            /*activeAt: {
              [Op.or]: {
                [Op.not]: sequelize.literal('NOW()'),
                [Op.is]: null
              }   
            }*/
        },
        // include customerID, listingID and listing name
        //include: {model: Transaction, attributes: ['listingID', 'customerID'], include: {model: Listing, attributes: ['name']}},
    }).then(n => {
        res.status(200).send({notifications: n})
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
};

/** mark notification as viewed
 * expected query param:
 * @param id notificationID
 */
exports.markNotificationAsViewed = (req, res) => {
    Notification.findOne({
        where: {
            notificationID: req.query.id
        }
    }).then(n => {
        if (!n)
            return res.status(404).send({ message: "Invalid notificationID" });
        if (n.userID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to mark another user's notification as viewed"});
        n.viewed = 'true';
        n.save().then(_ => {
           res.send({message: "Notification marked as viewed successfully"})
        })
    });
}


exports.postNotification= (req, res) => {
    Notification.create({
        type: req.body.type,
        userID: req.body.userID,
        listingID: req.body.listingID,
        reviewID: req.body.reviewID,
        transactionID: req.body.transactionID,
        accountID: req.body.accountID,
        viewed: 0,
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
}
