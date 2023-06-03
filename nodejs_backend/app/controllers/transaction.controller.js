const { transaction } = require("../models");
const db = require("../models");
const Transaction = db.transaction;
const Listing = db.listing;
const User = db.user;
const Notification = db.notification;
const Review = db.review;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;


/** get all transactions on a given listingid
 * expected Query param:
 * @param id listingID
 * @param ID 
 */
 exports.getListingTransactionsCheck = (req, res) => {
    // find listing
    Transaction.findAll({
        where: {
            listingID: req.query.id // get user from webtoken
        }}).then(transaction => {
            return res.status(200).send({transactions: transaction})
            });
}


/** get all transactions on a given listingid
 * expected Query param:
 * @param id listingID 
 */
exports.getListingTransactions = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // if (listing.userID !== req.userId)
        //     return res.status(401).send({ message: "Unauthorized to view another user's transactions on his listings"});
        // find all transactions
        Transaction.findAll({
            where: {
                listingID: listing.listingID
            },
            // include userdata (when user has no firstName and lastName use email as name)
            include: {model: User, attributes: ['userID', [db.sequelize.literal("CASE WHEN firstName = '' AND lastName = '' THEN email ELSE CONCAT(firstName, ' ', lastName) END"), 'name']]},
            order: [['time', 'DESC']],
        }).then(t => {
            // checkReviewable(t, 'user', res);
        })
    })
};


exports.getWrittenReviews = (req, res) => {
    Review.findAll({
        where: {
            writerID: req.query.id // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture', 'userID'],
      on: {
        col1: sequelize.where(sequelize.col("review.receiverID"), "=", sequelize.col("user.userID")),
    }
    },
    {
        model: Listing,
    }]
    }).then(review => {
            return res.status(200).send({review: review})});
}

exports.getReceivedReviews = (req, res) => {
    Review.findAll({
        where: {
            receiverID: req.query.id // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture'],
      on: {
        col1: sequelize.where(sequelize.col("review.writerID"), "=", sequelize.col("user.userID")),
    }
    },
    {
        model: Listing,
    }]
    }).then(review => {
            return res.status(200).send({review: review})});
}

// get all transactions made by given user
exports.getUserTransactionsL = (req, res) => {
    Transaction.findAll({
        where: {
            venueID: req.userId // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture'],
      on: {
        col1: sequelize.where(sequelize.col("transaction.artistID"), "=", sequelize.col("user.userID")),
    }
    },
    {
        model: Listing,
    }]
    }).then(transaction => {
            return res.status(200).send({transactions: transaction})});
}

exports.getUserArtistTransactionsL = (req, res) => {
    Transaction.findAll({
        where: {
            artistID: req.userId // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture'],
      on: {
        col1: sequelize.where(sequelize.col("transaction.venueID"), "=", sequelize.col("user.userID")),
    }
    },
    {
        model: Listing,
    }
]
    }).then(transaction => {
            return res.status(200).send({transactions: transaction})});     
}

// get all transactions made by given user
exports.getUserTransactions = (req, res) => {
    Transaction.findAll({
        where: {
            venueID: req.userId // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture'],
      on: {
        col1: sequelize.where(sequelize.col("transaction.artistID"), "=", sequelize.col("user.userID")),
    }
    }]
    }).then(transaction => {
            return res.status(200).send({transactions: transaction})});
}

exports.getUserArtistTransactions = (req, res) => {
    Transaction.findAll({
        where: {
            artistID: req.userId // get user from webtoken
        },
    include: [{
      model: User,
      attributes: ['displayName', 'profilePicture'],
      on: {
        col1: sequelize.where(sequelize.col("transaction.venueID"), "=", sequelize.col("user.userID")),
    }
    },
]
    }).then(transaction => {
            return res.status(200).send({transactions: transaction})});     
}


// function checkReviewable(transactions, reviewType, res){
//     if (transactions.length === 0)
//         return res.status(200).send({transactions: []});
//     let checkedTransactions = [];
//     transactions.forEach(x => {
//         Review.findOne({
//             where: {
//                 transactionID: x.transactionID,
//                 reviewType: reviewType
//             }
//         }).then(r => {
//             x.dataValues['reviewable'] = !Boolean(r) && Math.ceil((Date.now() - x.time) / (1000 * 60 * 60 * 24)) >= 10;
//             checkedTransactions.push(x);
//             if (checkedTransactions.length == transactions.length)
//                 res.status(200).send({transactions: checkedTransactions});
//         })
//     });
// }

/** creates transaction
 * expected params in body:
 * @param listingID
 * @param artistID
 * @param venueID
 * @param suggestedPay
 */
 exports.createTransaction = (req, res) => {
        Transaction.create({
            suggestedPay: req.body.suggestedPay,
            message: req.body.message,
            artistID: req.body.artistID, // get user from webtoken
            venueID: req.body.venueID,
            status: 'ArtistProposal',
            listingID: req.body.listingID,
            time: sequelize.literal('NOW()'),
            genre: req.body.genre,
            artistType: req.body.artistType
        }).then(t => {
            Notification.create({
                transactionID: t.transactionID,
                userID: req.body.receiverID,
                accountID: req.body.senderID,
                listingID: req.body.listingID,
                viewed:0,
                type:"incomingProp"
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


exports.addProposal = (req,res) => {
    Transaction.create({
        message: req.body.message,
        suggestedPay: req.body.suggestedPay,
        artistID: req.body.artistID, // get user from webtoken
        venueID: req.body.venueID,
        status: req.body.status,
        listingID: req.body.listingID,
        time: sequelize.literal('NOW()'),
        genre: req.body.genre,
        artistType: req.body.artistType
    }).then(t => {
        Notification.create({
            transactionID: t.transactionID,
            userID: req.body.receiverID,
            accountID: req.body.senderID,
            listingID: req.body.listingID,
            viewed:0,
            type:"incomingProp"
        });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}


exports.proposalToLog = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.body.transactionID,
            artistID: req.body.artistID,
            venueID: req.body.venueID,
        }}).then(transaction => {
            transaction.status = req.body.status;
            transaction.save().then(transaction => {
                res.send({ message: "Added to the History log!" });
            }).catch(err => {
            res.status(500).send({ message: err.message });
          });
        })
}

exports.acceptedProposal = (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.body.transactionID,
            artistID: req.body.artistID,
            venueID: req.body.venueID
        }}).then(transaction => {
            transaction.status = "AwaitingPayment";
            transaction.suggestedPrice = req.body.suggestedPrice;
            transaction.save().then(transaction => {
                res.send({ message: "transaction is now awaiting payment!" });
            }).catch(err => {
            res.status(500).send({ message: err.message });
          });
        });
}

exports.deleteAwaiting = (req, res) => {
    Transaction.findAll({
        where:{
            listingID:req.body.listingID,
        }
    }).then(transactions =>{
        if (transactions.length === 0){
        return res.status(404).send({ message: "No proposals found based on this information" });}
        let remainingDeletions = transactions.length;
        transactions.forEach(x => {
            x.destroy().then(_ => {
                if (remainingDeletions === 1)
                    res.send({message: "All categories with type successfully deleted!"})
                else
                    remainingDeletions -= 1;
            })
        })
    }).catch(err => {
        res.status(500).send({ message: err.message });
      });
}

exports.deleteListingProposals = (req, res) => {
    const { Op } = require("sequelize");
    Transaction.findAll({
        where: {
            listingID: req.body.listingID,
            status: {[Op.not]:'AwaitingPayment'}
        }}).then(transactions =>{
            if (transactions.length === 0){
            return res.status(404).send({ message: "No proposals found based on this information" });}
            let remainingDeletions = transactions.length;
            transactions.forEach(x => {
                x.destroy().then(_ => {
                    if (remainingDeletions === 1)
                        res.send({message: "All categories with type successfully deleted!"})
                    else
                        remainingDeletions -= 1;
                })
            })
        }).catch(err => {
            res.status(500).send({ message: err.message });
          });
}

exports.editProposal= (req, res) => {
    Transaction.findOne({
        where: {
            transactionID: req.body.transactionID,
            artistID: req.body.artistID,
            venueID: req.body.venueID
        }}).then(transaction => {
            transaction.message = req.body.message;
            transaction.suggestedPay = req.body.suggestedPay;
            transaction.genre = req.body.genre;
            transaction.artistType = req.body.type;
            transaction.save().then(transaction => {
                res.send({ message: "transaction suggestedPay was updated successfully!" });
            }).catch(err => {
            res.status(500).send({ message: err.message });
          });
        })
}

exports.deleteProposals= (req, res) => {
    Transaction.findAll({
        where: {
            listingID: req.body.listingID,
            artistID: req.body.artistID,
            venueID: req.body.venueID
        }}).then(transactions =>{
            if (transactions.length === 0){
            return res.status(404).send({ message: "No proposals found based on this information" });}
            let remainingDeletions = transactions.length;
            transactions.forEach(x => {
                x.destroy().then(_ => {
                    if (remainingDeletions === 1)
                        res.send({message: "All categories with type successfully deleted!"})
                    else
                        remainingDeletions -= 1;
                })
            })
        }).catch(err => {
            res.status(500).send({ message: err.message });
          });
}


/** cancels transaction (doesn't delete)
 * expected query param:
 * @param id transactionID 
 */
exports.cancelTransaction = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data
        // if (req.userId !== transaction.customerID && req.userId !== transaction.listing.userID) 
        //     return res.status(401).send({ message: "Unauthorized to cancel transaction"});
        // find listing
        Listing.findOne({
            where: {
                listingID: transaction.listingID
            }
        }).then(listing => {
            // catch error
            if (!listing)
                return res.status(404).send({ message: "Transaction has invalid listingID" });
            // update listing's available assets
            if (listing.availableAssets)
                listing.availableAssets += transaction.numberOfAssets;
            listing.save().then(_ => {
                // update transaction status
                transaction.status = 'cancelled';
                // Notification.create({
                //     transactionID: transaction.transactionID,
                //     viewed: false,
                //     userID: req.userId === listing.userID ? transaction.customerID : listing.userID,
                //     type: 'cancellation'
                // }).then(() => 
                //     transaction.save().then(_ => {
                //         res.send({ message: "Transaction was cancelled successfully!" });
                //     })
            })
                
            })
        })
    }

/** confirm payment of transaction
 * expected query param:
 * @param id transactionID 
 */
exports.confirmPayment = (req, res) => {
    // find transaction
    Transaction.findOne({
        where: {
            transactionID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(transaction => {
        // catch errors
        if (!transaction)
            return res.status(404).send({ message: "Invalid transactionID" });
        // compare user from webtoken with data 
        if (req.userId !== transaction.listing.userID)
            return res.status(401).send({ message: "Unauthorized to confirm payment"});
        // update transaction's status
        transaction.status = 'payed';
        // Notification.create({
        //     transactionID: transaction.transactionID,
        //     viewed: false,
        //     userID: transaction.customerID,
        //     type: 'payment confirmation'
        // })
        transaction.save().then(_ => {
            res.send({ message: "Payment was confirmed successfully!" });
        }) 
    })
}