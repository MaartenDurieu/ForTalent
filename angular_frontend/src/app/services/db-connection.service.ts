import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  // backend connection settings
  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  // create HTTP header with webtoken
  getTokenHeader(token: string){
    return new HttpHeaders().set('x-access-token', token);
  }

  /**
   * sign user in
   * @param login
   * @param password
   * @returns http response promise
   */
  signIn(login: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'login': login, 'password': password}).toPromise();
  }

  /**
   * sign user up (creates user)
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field password
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */

  /*firstName: req.body.firstName,
  lastName: req.body.lastName,
  authID: bcrypt.hashSync(req.body.password, 8), // hash password
  email: req.body.email,
  displayName: req.body.displayName,
  address: req.body.address,
  phoneNumber: req.body.phoneNumber,
  profilePicture: req.body.profilePicture,
  profileBanner: req.body.profileBanner,
  description: req.body.description,
  accountType: req.body.accountType
})*/
  signUp(fields: Object ){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }

  /**
   * get userdata
   * @param id userID
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserData(id: number, userToken: string){
    return this.http.get(`${this.url}/api/userdata?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * update userdata
   * @param id userID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  postUserData(id: number, userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/userdata?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  changeReviewScore(id: number, score:number){
    return this.http.post(`${this.url}/api/changescore?id=${id}`, {score:score}).toPromise();
  }

  /**
   * get profile picture
   * @param userID userID
   * @returns http response promise
   */
  getProfilePicture(userID: number){
    return this.http.get(`${this.url}/api/userPicture?id=${userID}`).toPromise();
  }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   * @param userToken webtoken
   * @returns http response promise
   */
  changePassword(oldPassword: string, newPassword: string, userToken: string){
    return this.http.post(`${this.url}/api/user/changePassword`, {oldPassword: oldPassword, newPassword: newPassword}, {headers: this.getTokenHeader(userToken)}).toPromise();
  }


  // getUserTransactions(userToken: string){
  //   return this.http.get(`${this.url}/api/transactions/userVenue`, {headers: this.getTokenHeader(userToken)}).toPromise();
  // }

  /**
   * get all listings
   * @returns http response promise
   */
  getAllListings(){
    return this.http.get(`${this.url}/api/listings`).toPromise();
  }

  getVenueMergedListings(userId: number){
    return this.http.get(`${this.url}/api/listings/mergeC?id=${userId}`).toPromise();
  }

  getArtistMergedListings(userId: number){
    return this.http.get(`${this.url}/api/listings/merge?id=${userId}`).toPromise();
  }

  /**
   * get all listings made by given user
   * @param userId userID
   * @returns http response promise
   */
  getUserListings(userId: number){
    return this.http.get(`${this.url}/api/listings/user?id=${userId}`).toPromise();
  }

  getArtistListings(userId: number){
    return this.http.get(`${this.url}/api/listings/artist?id=${userId}`).toPromise();
  }

  /**
   * create listing
   * @param userToken webtoken
   * @param fields (not required)
   *  @field description
   *  @field date
   *  @field suggestedPrice
   *  @field location
   *  @field startTime
   *  @field endTime
   *  @field genre
   *  @field artistType
   *  @field public
   * @returns http response promise
   */
  createListing(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  postNotification(userID: number, transactionID: number, listingID: number, reviewID: number, accountID: number,type: string){
    return this.http.post(`${this.url}/api/writeNotification`, {userID:userID,transactionID:transactionID,listingID:listingID, reviewID:reviewID,accountID:accountID,type:type}).toPromise();
  }


  /**
   * get listingdata
   * @param id listingID
   * @returns http response promise
   */
  getListing(id: number){
    return this.http.get(`${this.url}/api/listing?id=${id}`).toPromise();
  }


  deleteAwaiting(listingID: number){
    return this.http.post(`${this.url}/api/transactions/deleteAwaiting`,  {listingID: listingID}).toPromise();
  }

  acceptOfferListing(id: number,  artistID: number, status: string, genre:string, type:string, price:number){
    return this.http.post(`${this.url}/api/listing/acceptOfferListing`,  {id: id, artistID: artistID, status: status, genre:genre, type:type, price:price}).toPromise();
  }

  updateListingStatusAwaiting(id: number,  artistID: number, status: string){
    return this.http.post(`${this.url}/api/listing/updateAwaiting`,  {id: id, artistID: artistID, status: status}).toPromise();
  }

  updateListingStatusReviewed(id: number, status: string){
    return this.http.post(`${this.url}/api/listing/updateReview`,  {id: id, status: status}).toPromise();
  }
  /**
   * update listingdata
   * @param id listingID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field date
   *  @field price
   *  @field picture: image in base64 format
   *  @field location
   * @returns http response promise
   */
  postListing(id: number,  userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancel listing
   * @param id listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelListing(id: number,  userToken: string){
    return this.http.get(`${this.url}/api/listing/cancel?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions on a given listing
   * @param listingID listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  getListingTransactions(listingID: number, userToken: string){
    return this.http.get(`${this.url}/api/transactions/listing?id=${listingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions on a given listing
   * @param listingID listingID
   * @param userToken webtoken
   * @returns http response promise
   */
   getListingTransactionsCheck(listingID: number, userToken: string){
    return this.http.get(`${this.url}/api/transactions/listingCheck?id=${listingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

 
  getWrittenReviews(userId: number){
    return this.http.get(`${this.url}/api/transactions/written?id=${userId}`).toPromise();
  }

  getReceivedReviews(userId: number){
    return this.http.get(`${this.url}/api/transactions/received?id=${userId}`).toPromise();
  }

  getUserTransactionsL(userToken: string){
    return this.http.get(`${this.url}/api/transactions/userVenueL`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getUserArtistTransactionsL(userToken: string){
    return this.http.get(`${this.url}/api/transactions/userArtistL`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions made by given user
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserTransactions(userToken: string){
    return this.http.get(`${this.url}/api/transactions/userVenue`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getUserArtistTransactions(userToken: string){
    return this.http.get(`${this.url}/api/transactions/userArtist`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  followAccount(userID: number, followerID: number){
    return this.http.post(`${this.url}/api/followAccount`, {userID: userID, followerID: followerID}).toPromise();
  }

  sendMessage(senderID: number, receiverID: number, content:string){
    return this.http.post(`${this.url}/api/sendMessage`, {senderID: senderID, receiverID: receiverID, content:content}).toPromise();
  }

  getMessages(conversationID: number){
    return this.http.get(`${this.url}/api/getMessages?id=${conversationID}`).toPromise();
  }

  getLastMessagesConID(id: number){
    return this.http.get(`${this.url}/api/getLastMessagesConID?id=${id}`).toPromise();
  }

  getMostRecentMessage(id: number){
    return this.http.get(`${this.url}/api/getMostRecentMessage?id=${id}`).toPromise();
  }

  createConversation(user1ID: number, user2ID: number){
    return this.http.post(`${this.url}/api/createConversation`, {user1ID: user1ID, user2ID: user2ID}).toPromise();
  }

  getUserConversations(id: number){
    return this.http.get(`${this.url}/api/getUserConversations?id=${id}`).toPromise();
  }
  /**
   * create transaction
   * @param userToken webtoken
   * @param fields
   *  @field listingID
   *  @field numberOfAssets
   * @returns http response promise
   */
  createTransaction(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/transaction/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  addProposal(listingID: number, artistID: number, venueID: number, status: string, suggestedPay: number, message:string, senderID: number, receiverID: number, genre: string, artistType: string){
    return this.http.post(`${this.url}/api/transactions/proposal`, {listingID: listingID, artistID: artistID, venueID: venueID, status: status, suggestedPay: suggestedPay, message: message, senderID:senderID,receiverID:receiverID, genre:genre, artistType:artistType}).toPromise();
  }

  proposalToLog(transactionID: number, artistID: number, venueID: number, status: string){
    return this.http.post(`${this.url}/api/transactions/history`, {transactionID: transactionID, artistID: artistID, venueID: venueID, status: status}).toPromise();
  }

  acceptedProposal(transactionID: number, artistID: number, venueID: number, suggestedPrice: number){
    return this.http.post(`${this.url}/api/transactions/accept`, {transactionID: transactionID, artistID: artistID, venueID: venueID, suggestedPrice: suggestedPrice}).toPromise();
  }

  editProposal(transactionID: number, artistID: number, venueID: number, suggestedPay: number, message: string, genre:string, type:string){
    return this.http.post(`${this.url}/api/transactions/edit`, {transactionID: transactionID, artistID: artistID, venueID: venueID, suggestedPay: suggestedPay, message: message, genre: genre, type:type}).toPromise();
  }

  deleteListingProposals(listingID: number){
    return this.http.post(`${this.url}/api/transactions/deleteAll`, {listingID: listingID}).toPromise();
  }

  expireListing(listingID: number){
    return this.http.post(`${this.url}/api/listing/expire`, {listingID: listingID}).toPromise();
  }

  deleteListing(listingID: number){
    return this.http.post(`${this.url}/api/listing/delete`, {listingID: listingID}).toPromise();
  }

  NotificationsCancel(listingID: number, artistID: number, venueID: number){
    return this.http.post(`${this.url}/api/cancelNotification`, {listingID: listingID, artistID: artistID, venueID: venueID}).toPromise();
  }

  /**
   * Deletes all proposals stops negotiation
   * @param listingID 
   * @param fields
   * @param artistID 
   * @param venueID 
   */
  deleteProposals(listingID: number, artistID: number, venueID: number){
    return this.http.post(`${this.url}/api/transactions/delete`, {listingID: listingID, artistID: artistID, venueID: venueID}).toPromise();
  }

  NotificationsRemove(listingID:number, type:string){
    return this.http.post(`${this.url}/api/removeNotification`, {listingID: listingID, type: type}).toPromise();
  }
  /**
   * cancels transaction (doesn't delete)
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelTransaction(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/cancel?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * confirm payment of transaction
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  confirmPayment(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/confirmPayment?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  // get all categories
  getCategories(){
    return this.http.get(`${this.url}/api/categories`).toPromise();
  }

  /**
   * delete category
   * @param name category name
   * @returns http response promise
   */
  deleteCategory(name: string){
    return this.http.post(`${this.url}/api/category/delete`, {name: name}).toPromise();
  }

  /**
   * delete categories with type
   * @param type category type
   * @returns http response promise
   */
  deleteCategoryType(type: string){
    return this.http.post(`${this.url}/api/category/deleteType`, {type: type}).toPromise();
  }

  /**
   * create category
   * @param fields
   *  @field name (required)
   *  @field type
   * @returns http response promise
   */
  createCategory(fields: object){
    return this.http.post(`${this.url}/api/category/create`, fields).toPromise();
  }

  /**
   * // get all notifications from user
   * @param userToken web token
   * @returns http response promise
   */
  getUserNotifications(userToken: string){
    return this.http.get(`${this.url}/api/notifications`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getUserNotificationsMerged(userToken: string){
    return this.http.get(`${this.url}/api/notificationsMerged`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getUserNotificationsMergedALL(userToken: string){
    return this.http.get(`${this.url}/api/notificationsMergedALL`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }
  /**
   * mark notification as viewed
   * @param notificationID notificationID
   * @param userToken web token
   * @returns http response promise
   */
  markNotificationAsViewed(notificationID: number, userToken: string){
    return this.http.get(`${this.url}/api/notification/markViewed?id=${notificationID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

 /* createListing(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }*/
  /**
   * post a review
   * @param transactionID transactionID
   * @param fields
   *  @field comment
   *  @field score [1-5]
   * @returns http response promise
   */
  postReview(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/review`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all reviews on listing
   * @param ListingID listingID
   * @returns http response promise
   */
  getListingReviews(listingID: number){
    return this.http.get(`${this.url}/api/reviews/listing?id=${listingID}`).toPromise();
  }

  /**
   * get all reviews on user
   * @param userID userID
   * @returns http response promise
   */
  getUserReviews(userID: number){
    return this.http.get(`${this.url}/api/reviews/user?id=${userID}`).toPromise();
  }
}
