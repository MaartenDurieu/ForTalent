const db = require("../models");
const sequelize = require('sequelize');
const { user, listing } = require("../models");
const Listing = db.listing;
const Transaction = db.transaction;
const User = db.user;
const Notification = db.notification;
const Review = db.review;
const Op = db.Sequelize.Op;

//https://sebhastian.com/sequelize-join/


// returns all listings
exports.getAllListings = (req, res) => {
    // db.sequelize.query("SELECT * FROM Gig_R_Database.listing;")
    db.sequelize.query("SELECT l.*,u.displayName,u.reviewScore,u.profilePicture FROM Gig_R_Database.listing l  LEFT OUTER JOIN Gig_R_Database.user u ON l.userID = u.userID;")
        .then(l => {
            return res.status(200).send({listings: l[0]})
        })
    /*db.sequelize.query("SELECT l.*, r.avgScore, r.reviewAmount FROM listing as l LEFT JOIN (SELECT listingID, cast(AVG(score) as decimal(3,2)) as avgScore, IFNULL(COUNT(score), 0) as reviewAmount FROM review as r INNER JOIN transaction as t USING (transactionID) WHERE r.reviewType = 'listing' GROUP BY t.listingID) as r USING(listingID)")
        .then(l => {
            return res.status(200).send({listings: l[0]})
        })*/
};
 
exports.getVenueMergedListings = (req, res) => {
    Listing.findAll({
        where:{
            artistID: req.query.id
        },
        include: [{
            model:User,
            on: {
                col1: sequelize.where(sequelize.col("listing.userID"), "=", sequelize.col("user.userID")),
            },
        }]
    }).then(listings => {
        res.status(200).send({listings: listings})
    });
}


//https://stackoverflow.com/questions/42226351/sequelize-join-with-multiple-column
exports.getArtistMergedListings = (req, res) => {
    Listing.findAll({
        where: {
            userID: req.query.id
        },
        include: [{
            model:User,
            on: {
                col1: sequelize.where(sequelize.col("listing.artistID"), "=", sequelize.col("user.userID")),
            },
        }]

    }).then(listings => {
        res.status(200).send({listings: listings})
    });
}

/** get all listings made by given user
 * expected query param:
 * @param id userID 
 */

exports.getArtistListings = (req, res) => {
    Listing.findAll({
        where: {
            artistID: req.query.id
        }
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};



exports.getUserListings = (req, res) => {
    Listing.findAll({
        where: {
            userID: req.query.id
        }
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};

exports.acceptOfferListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.body.id,
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // save data
        listing.genre = req.body.genre,
        listing.artistType = req.body.type,
        listing.status = req.body.status,
        listing.artistID = req.body.artistID,
        listing.suggestedPrice = req.body.price
        listing.save().then(_ => {
            res.send({ message: "Listing was updated successfully!"});
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};


exports.updateListingStatusAwaiting = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.body.id,
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // save data
        listing.status = req.body.status,
        listing.artistID = req.body.artistID
        listing.save().then(_ => {
            res.send({ message: "Listing was updated successfully!"});
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};

exports.updateListingStatusReviewed = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.body.id,
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // save data
        listing.status = req.body.status,
        listing.save().then(_ => {
            res.send({ message: "Listing was updated successfully!"});
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};
/** create listing
 * expected params in body (not required):
 * @param description
 * @param date
 * @param startTime
 * @param endTime
 * @param suggestedPrice
 * @param genre 
 * @param artistType
 * @param location
 * @param title
 * @param listingBanner
 * @param listingPicture
 */
exports.createListing = (req, res) => {
    Listing.create({
        description: req.body.description,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        genre: req.body.genre,
        artistType: req.body.artistType,
        suggestedPrice: req.body.suggestedPrice,
        location: req.body.location,
        public: req.body.public,
        status: 'active',
        userID: req.userId,
        title: req.body.title,
        listingBanner: req.body.listingBanner,
        listingPicture: req.body.listingPicture
    }).then(l => {
        res.send({ message: "Listing was created successfully!", listingID: l.listingID });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}


/** get listingdata
 * expected query param:
 * @param id listingID 
 */
exports.getListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
        // include userName extracted from user
        include: {model: User, attributes: ['displayName']},
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // send listingdata
        res.status(200).send({
            listingID: listing.listingID,
            description: listing.description,
            date: listing.date,
            suggestedPrice: listing.suggestedPrice,
            location: listing.location,
            status: listing.status,
            userID: listing.userID,
            artistID: listing.artistID,
            genre: listing.genre,
            artistType: listing.artistType,
            startTime: listing.startTime,
            endTime: listing.endTime,
            public: listing.public,
            title: listing.title,
            listingBanner: listing.listingBanner,
            listingPicture: listing.listingPicture
        })
    })
    
};

/** update listingdata
 * expected query param:
 * @param id listingID
 * expected params in body (not required):
 * @param description
 * @param date
 * @param suggestedPrice
 * @param location
 * @param startTime
 * @param endTime
 * @param genre
 * @param artistType
 * @param listingBanner
 * @param listingPicture
 */
exports.postListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== listing.userID)
            return res.status(401).send({ message: "Unauthorized to edit another user's listing"});
        // save data
        listing.description = req.body.description
        listing.date = req.body.date
        listing.suggestedPrice = req.body.suggestedPrice
        listing.location = req.body.location
        listing.genre = req.body.genre
        listing.title = req.body.title
        listing.startTime = req.body.starttime
        listing.endTime = req.body.endtime
        listing.artistType = req.body.artistType
        listing.startTime = req.body.startTime
        listing.endTime = req.body.endTime
        listing.listingBanner = req.body.listingBanner
        listing.listingPicture = req.body.listingPicture
        listing.save().then(_ => {
            res.send({ message: "Listing was updated successfully!"});
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};

exports.deleteListing = (req, res) => {
    const { Op } = require("sequelize");
    Notification.findAll({
        where: {
            listingID: req.body.listingID
        }
    }).then(notifications => {
        let remainingDel = notifications.length;
        notifications.forEach(n => {
            n.destroy().then(_ => {
                remainingDel -= 1;
            })
        })
    });
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }}).then(listing => {
            //Send notification to all artists who have outgoing or incoming proposals for this listing
            Transaction.findAll({
                where: {
                    listingID: listing.listingID,
                    [Op.or]: [{status:"venueProposal"},{status:"artistProposal"}] 
                }}).then(transactions => {
                    transactions.forEach(t => {
                            Notification.create({
                                viewed: false,
                                userID: t.artistID,
                                accountID: t.venueID,
                                type: "deletedListing"
                            })
                        });
                });
            //Once all notifications are written delete the proposals on the listing
            Transaction.findAll({
                where: {
                    listingID: listing.listingID
                }}).then(trs => {
                    let remainingDeletions = trs.length;
                    trs.forEach(x => {
                        x.destroy().then(_ => {
                            remainingDeletions -= 1;
                        })
                    })
                })
            Listing.findOne({
                where: {
                    listingID: req.body.listingID
                }
            }).then(listing => {
                listing.destroy().then(_ => res.send({message: "Listing has been deleted"}))
            })
            });
}

exports.expireListing = (req, res) => {
    const { Op } = require("sequelize");
    Notification.findAll({
        where: {
            listingID: req.body.listingID
        }
    }).then(notifications => {
        let remainingDel = notifications.length;
        notifications.forEach(n => {
            n.destroy().then(_ => {
                remainingDel -= 1;
            })
        })
    });
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }}).then(listing => {
            //Send notification to the venue that their listing has expired
            Notification.create({
                viewed: false,
                userID: listing.userID,
                type: "expiredListing"
            })
            //Send notification to all artists who have outgoing or incoming proposals for this listing
            Transaction.findAll({
                where: {
                    listingID: listing.listingID,
                    [Op.or]: [{status:"venueProposal"},{status:"artistProposal"}] 
                }}).then(transactions => {
                    transactions.forEach(t => {
                            Notification.create({
                                viewed: false,
                                userID: t.artistID,
                                accountID: t.venueID,
                                type: "expiredListing"
                            })
                        });
                });
            //Once all notifications are written delete the proposals on the listing
            Transaction.findAll({
                where: {
                    listingID: listing.listingID
                }}).then(trs => {
                    let remainingDeletions = trs.length;
                    trs.forEach(x => {
                        x.destroy().then(_ => {
                            remainingDeletions -= 1;
                        })
                    })
                })
            Listing.findOne({
                where: {
                    listingID: req.body.listingID
                }
            }).then(listing => {
                listing.destroy().then(_ => res.send({message: "Listing has expired"}))
            })
            });
}


/** cancel listing
 * expected query param:
 * @param id listingID
 */
exports.cancelListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID"});
        if (req.userId !== listing.userID)
            return res.status(401).send({ message: "Unauthorized to cancel another user's listing"});
        // cancel all transactions
        Transaction.findAll({
            where: {
                listingID: listing.listingID
            }
        }).then(transactions => {
            // cancel all transactions of listing
            // transactions.forEach(t => {
            //     t.status = 'cancelled';
            //     Notification.create({
            //         transactionID: t.transactionID,
            //         viewed: false,
            //         userID: t.customerID,
            //         type: 'cancellation'
            //     }).then(_ => t.save())
            // });
            // cancel listing
            listing.status = 'cancelled'
            listing.save().then(_ => {
                res.send({ message: "Listing was cancelled successfully!" });
            })
        })
        
    })
}
