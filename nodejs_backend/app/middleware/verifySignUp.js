const db = require("../models");
const User = db.user;

/** checks if email is already in use
 * expected param in body:
 * @param email
 */
checkDuplicateEmail = (req, res, next) => {
  // find user with email
  User.findOne({ where: { email: req.body.email }}).then(user => {
    // catch error
    if (user)
      return res.status(400).send({ message: "Email has already been registered" });
    next();
  });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
};
  
module.exports = verifySignUp;