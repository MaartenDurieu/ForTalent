const express = require("express");
const cors = require("cors");
const PORT = 3000;

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({limit: '5mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();

// routess
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/listing.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/category.routes')(app);
require('./app/routes/following.routes')(app);
require('./app/routes/notification.routes')(app);
require('./app/routes/review.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/conversation.routes')(app);

// listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});