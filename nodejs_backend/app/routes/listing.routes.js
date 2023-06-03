const { authJwt } = require("../middleware");
const controller = require("../controllers/listing.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get(
      "/api/listings",
      controller.getAllListings
    );
  
    app.get(
      "/api/listings/user",
      controller.getUserListings
    );

    app.get(
      "/api/listings/artist",
      controller.getArtistListings
    )

    app.post(
      "/api/listing/create",
      [authJwt.verifyToken],
      controller.createListing
    );

    app.post(
      "/api/listing/acceptOfferListing",
      controller.acceptOfferListing
    );

    app.post(
      "/api/listing/updateAwaiting",
      controller.updateListingStatusAwaiting
    );

    app.post(
      "/api/listing/updateReview",
      controller.updateListingStatusReviewed
    );
    
    app.get(
      "/api/listing",
      controller.getListing
    );

    app.post(
      "/api/listing/expire", 
      controller.expireListing
    );

    app.post(
      "/api/listing/delete", 
      controller.deleteListing
    );

    app.post(
      "/api/listing",
      [authJwt.verifyToken],
      controller.postListing
    );

    app.get(
      "/api/listing/cancel",
      [authJwt.verifyToken],
      controller.cancelListing
    );

    app.get(
      "/api/listings/mergeC",
      controller.getVenueMergedListings
    );

    app.get(
      "/api/listings/merge",
      controller.getArtistMergedListings
    );
  };