const db = require("../models");
const Notification = db.notification;
const Transaction = db.transaction;
const { following } = require("../models");
const Listing = db.listing;
const Op = db.Sequelize.Op
const sequelize = db.sequelize;
const Following = db.following;
const Conversation = db.conversation;
const Message = db.message;

exports.createConversation = (req, res) => {
    Conversation.create({
        user1ID: req.body.user1ID,
        user2ID: req.body.user2ID,
    }).then(c => {
        res.send({ conversationID: c.conversationID});
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getUserConversations = (req,res) => {
    const { Op } = require("sequelize");
    Conversation.findAll({
        where:{
            [Op.or] :[{user1ID: req.query.id},{user2ID: req.query.id}]
        },
        group:["conversationID"]
    }).then(conversations => {res.status(200).send({conversations: conversations}) 
    });        
}