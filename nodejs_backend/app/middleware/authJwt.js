const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

// verify webtoken and extract user
// expects http header "x-access-token"
verifyToken = (req, res, next) => {
    // find webtoken in headers
    let token = req.headers["x-access-token"];
    // catch error
    if (!token) return res.status(403).send({ message: "No token provided!"});
    // validate webtoken
    jwt.verify(token, config.KEY, (err, decoded) => {
      // catch error
      if (err) return res.status(401).send({ message: "Unauthorized!"});
      // add userID to request object
      req.userId = decoded.id;
      // pass request to next func
      next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};
module.exports = authJwt;