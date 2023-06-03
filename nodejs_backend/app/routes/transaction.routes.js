const { authJwt } = require("../middleware");
const controller = require("../controllers/transaction.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
      "/api/transactions/listing",
      controller.getListingTransactions
    );
    
    app.get(
      "/api/transactions/listingCheck",
      [authJwt.verifyToken],
      controller.getListingTransactionsCheck
    );
 
    app.get(
      "/api/transactions/userVenueL",
      [authJwt.verifyToken],
      controller.getUserTransactionsL,
    );

    app.get(
      "/api/transactions/received",
      controller.getReceivedReviews,
    );

    app.get(
      "/api/transactions/written",
      controller.getWrittenReviews,
    );

    app.get(
      "/api/transactions/userArtistL",
      [authJwt.verifyToken],
      controller.getUserArtistTransactionsL,
    );

    app.get(
      "/api/transactions/userVenueL",
      [authJwt.verifyToken],
      controller.getUserTransactionsL,
    );

    app.get(
      "/api/transactions/userArtist",
      [authJwt.verifyToken],
      controller.getUserArtistTransactions,
    );

    app.post(
      "/api/transactions/accept", 
      controller.acceptedProposal
    );

    app.post(
      "/api/transactions/edit", 
      controller.editProposal
    );
    app.post(
      "/api/transactions/deleteAwaiting",
      controller.deleteAwaiting
    );
    app.post(
      "/api/transactions/deleteAll", 
      controller.deleteListingProposals
    );
    
    app.post(
      "/api/transactions/delete", 
      controller.deleteProposals
    );
    
    app.post(
      "/api/transactions/history", 
      controller.proposalToLog
    );
    app.post(
      "/api/transactions/proposal", 
      controller.addProposal
    );

    app.post(
      "/api/transaction/create",
      [authJwt.verifyToken],
      controller.createTransaction
    );

    app.get(
      "/api/transaction/cancel",
      [authJwt.verifyToken],
      controller.cancelTransaction
    );

    app.get(
      "/api/transaction/confirmPayment",
      [authJwt.verifyToken],
      controller.confirmPayment
    );
  };