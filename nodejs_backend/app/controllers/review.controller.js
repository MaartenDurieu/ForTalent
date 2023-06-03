const db = require("../models");
const sequelize = require('sequelize');
const Review = db.review;
const Transaction = db.transaction;
const Listing = db.listing;
const User = db.user;
const Notification = db.notification;


exports.postReview = (req, res) => {
    Review.create({
        avgScore: req.body.avgScore,
        writerID: req.body.writerID,
        receiverID: req.body.receiverID,
        onTime: req.body.onTime,
        professionalism: req.body.professionalism,
        friendly: req.body.friendly,
        collaboration: req.body.collaboration,
        music: req.body.music,
        originality: req.body.originality,
        audience: req.body.audience,
        experience: req.body.experience,
        atmosphere: req.body.atmosphere,
        accomodation: req.body.accomodation,
        acoustics: req.body.acoustics,
        organisation: req.body.organisation,
        helpful: req.body.helpful,
        listingID: req.body.listingID,
        reviewText: req.body.reviewText,
    }).then(r => {
        Notification.create({
            reviewID: r.reviewID,
            viewed: 0,
            userID: req.body.receiverID,
            accountID: req.body.writerID,
            listingID: req.body.listingID,
            type: 'receivedReview'
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
 
}

/** get all reviews on listing
 * expected query param:
 * @param id listingID 
 */
exports.getListingReviews = (req, res) => {
    Review.findAll({
        include: {
            model: Transaction,
            include: {
                model: User,
                attributes: ['userName', 'profilePicture']
            },
            attributes: ['listingID', 'customerID']
        },
        where: {
            reviewType: 'listing',
            '$transaction.listingID$': req.query.id
        },
        attributes: ['reviewID', 'score', 'comment', 'transaction.user.userName']
    }).then(r => {
        // send data
        return res.status(200).send({reviews: r, score: getAvgScore(r)})
    })
}

/** get all reviews on user
 * expected query param:
 * @param id userID 
 */
exports.getUserReviews = (req, res) => {
    Review.findAll({
        include: {
            model: Transaction,
            attributes: ['customerID']
        },
        where: {
            reviewType: 'user',
            '$transaction.customerID$': req.query.id
        }
    }).then(r => {
        // send data
        return res.status(200).send({reviews: r, score: getAvgScore(r)})
    })
}

// calculates average score of all reviews
function getAvgScore(obj){
    return [obj.map(x => x.score).reduce((m, x) => {
            m[0] += 1
            m[1] += x
            return m
        }, [0, 0])].map(x => x[1] / x[0] || 0)[0]
}