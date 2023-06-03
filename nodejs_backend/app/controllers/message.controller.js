const db = require("../models");
const Notification = db.notification;
const Transaction = db.transaction;
const { following } = require("../models");
const Listing = db.listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;
const Following = db.following;
const Message = db.message;
const Conversation = db.conversation;
const User= db.user;


exports.sendMessage = (req, res) => {
    Message.create({
        senderID: req.body.senderID,
        receiverID: req.body.receiverID,
        content: req.body.content,
        time: sequelize.literal('NOW()'),
        conversationID: req.body.conversationID
    }).then(l => {
        res.send({ message: "Message was succesfully sent",messageID: l.messageID});
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}


exports.getMessages = (req,res) => {;
    Message.findAll({
        where:{
            conversationID: req.query.id
        },
    }).then(m => {
        res.send({messages:m})
    });
}

exports.getMostRecentMessage = (req,res) => {
    Message.findAll({
        limit: 1,
        where: {
            conversationID: req.query.id,
        },
        order: [ [ 'time', 'DESC' ]]
      }).then(m => {
        res.send({messages:m[0]});
        })
}

exports.getLastMessagesConID = (req,res) => {;
    const { Op } = require("sequelize");
    Message.findAll({ 
        where:{
            [Op.or] :[{senderID: req.query.id},{receiverID: req.query.id}]
        },
        attributes:["conversationID"],
        group:["conversationID"],
    }).then(m=> {
        res.send({messages:m})
    });
}
