const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

/** get userdata
 * expected query param:
 * @param id userID 
 */
exports.getUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // send data
        res.status(200).send({
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            displayName: user.displayName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            profileBanner: user.profileBanner,
            description: user.description,
            accountType: user.accountType,
            reviewScore: user.reviewScore
        });
    })
};

/** update userdata
 * expected query param:
 * @param id userID
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param email
 * @param displayName
 * @param address
 * @param phoneNumber
 * @param profilePicture
 * @param profileBanner
 * @param description
 */
exports.postUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.displayName = req.body.displayName;
        user.address = req.body.address;
        user.phoneNumber = req.body.phoneNumber;
        user.profilePicture = req.body.profilePicture;
        user.profileBanner = req.body.profileBanner;
        user.description = req.body.description;
        user.accountType = req.body.accountType;
        user.save().then(user => {
            res.send({ message: "Userdata was updated successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};

/**
 * expected params in body:
 * @param oldPassword
 * @param newPassword
 */
exports.changePassword = (req, res) => {
    // finds user using webtoken
    User.findOne({
    where: {
        userID: req.userId
    }
    }).then(user => {
        // catch errors
        if (!user)
            return res.status(404).send({ message: "No user matching webtoken found"});
        if (!bcrypt.compareSync(req.body.oldPassword,user.authID))
            return res.status(401).send({message: "Invalid Password"});
        // save hashed password
        user.authID = bcrypt.hashSync(req.body.newPassword, 8) 
        user.save().then(_ => {
            res.send({message: "Password updated successfully"})
        })
    })
}

exports.changeReviewScore = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        user.reviewScore = req.body.score;
        user.save().then(user => {
            res.send({ message: "Reviewscore was updated successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};
/**
 * expected param in query
 * @param id userID 
 */
exports.getProfilePicture = (req, res) => {
    // finds user using id in query
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(u => {
        // catch errors
        if (!u)
            return res.status(404).send({ message: "No user matching webtoken found"});
        res.send({profilePicture: u.profilePicture})
    })
}