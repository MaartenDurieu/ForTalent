import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DbConnectionService } from './services/db-connection.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('myDiv') myDiv: ElementRef;
  title = 'ForTalent';
  currentUrl: string;
  notifications: object[] = [];
  listingsChecker: object[] = [];
  reviewChecker: object[] = [];
  timeToRefresh = 2000; // time in ms -> 1000 ms = 1 second
  venueAccount: boolean;

  //My Listings Notifications
  expiredListingNot: number=0;
  account:string = 'Artist';

  //Review notifications
  writeReviewNot: number=0;
  receivedReviewNot: number=0;

  //Proposal notifications 
  incomingPropNot: number=0;
  offerAcceptedNot: number=0;
  rejectedCancelledExpiredNot: number=0; //rejectedNegotiation + cancelledNegotiation + expiredListing (for artists)

  //Calendar
  paymentReceivedNot: number=0;

  //transactionsnumber
  transactionsNot: number=0;

  ngOnInit(){
    this.db.getUserData(this.user.getId(), this.user.getLoginToken()).then(l => {if(l['accountType']==='Artist'){
      document.getElementById('myDiv').style.display = "none";
    };})
  }

  constructor(public user: UserService,
    private db: DbConnectionService,
    private router: Router){
      this.collectNotifications();
      this.ListingsDateChecker();
      // repeatedly check for notifications, if listings have expired and if listings are now reviewable
      setInterval(() => {
        this.collectNotifications();
        this.ListingsDateChecker();
      }, this.timeToRefresh);
  }


  collectNotifications(){
    //Display the amount of new notifications on the main page for each category
    this.db.getUserNotifications(this.user.getLoginToken()).then(notifications => {

      //For "My Listings"
      this.expiredListingNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="expiredListing")&&(f["accountID"]==null)).length;

      //For "Reviews"
      this.receivedReviewNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="receivedReview")).length;
      this.writeReviewNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="writeReview")).length;

      //For "Proposals"
      this.rejectedCancelledExpiredNot = notifications["notifications"]
        .filter(f => f["viewed"]==0 
          && ((f["type"]=="expiredListing" && f["accountID"]!=null) 
          || f["type"]=="deletedListing"
          || f["type"]=="cancelledNegotiation"
          || f["type"]=="rejectedNegotiation")).length;
      this.incomingPropNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="incomingProp")).length;
      this.offerAcceptedNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="offerAccepted")).length;

      this.transactionsNot = this.rejectedCancelledExpiredNot + this.incomingPropNot + this.offerAcceptedNot
      //For "Calendar"
      this.paymentReceivedNot = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="paymentReceived")).length;
    })
  }

  ListingsDateChecker(){
    //If the listing date has passed, but was not filled: delete the listing
    //And all the proposals: Also notify all artists that had a proposal on the listing
    this.db.getAllListings().then(l => {this.listingsChecker = l["listings"].filter(filtered => {
        return filtered.status==="active";});
      this.reviewChecker = l["listings"].filter(filtered => {
        return filtered.status==="Filled";});
      var today = new Date();
      var dateNow = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
      // for(var i of this.listingsChecker){
      //   var listingDate = new Date(i["date"]);
      //   if(listingDate < dateNow){
      //     //Listing has expired: delete the listing and all the proposals on it
      //     //Shoot a notification to venue owner: and artists that made a proposal on the listing
      //     this.db.expireListing(i["listingID"]);
      //   }
      // }
      // for(var i of this.reviewChecker){
      //   var listingDate = new Date(i["date"]);
      //   var reviewDate = new Date(listingDate.getFullYear()+'-'+(listingDate.getMonth()+1)+'-'+(listingDate.getDate()+2));
      //   if(reviewDate < dateNow){
      //     //2 days have past since the performance happend
      //     //Now set the status of the listing to reviewable
      //     this.db.updateListingStatusAwaiting(i["listingID"],i["artistID"],"Reviewable");
      //     //For the venue
      //     this.db.postNotification(i["userID"],null,i["listingID"],null,i["artistID"],"writeReview");
      //     //For the artist
      //     this.db.postNotification(i["artistID"],null,i["listingID"],null,i["userID"],"writeReview");
      //   }}
    })
  }

  // turn notification into message
  // getNotificationMessage(notification: object): string{
  //   switch (notification['type']) {
  //     case 'new transaction':
  //       return `A new transaction was made on your ${notification['transaction'].listing.name}`
  //     case 'cancellation':
  //       if (notification['transaction'].customerID === this.user.getId())
  //         return `Your transaction on ${notification['transaction'].listing.name} has been cancelled`
  //       else
  //         return `A transaction on your ${notification['transaction'].listing.name} has been cancelled`
  //     case 'payment confirmation':
  //       return `Your payment on ${notification['transaction'].listing.name} has been confirmed`
  //     case 'reviewable':
  //       return `You can review your recent transaction of ${notification['transaction'].listing.name}`
  //     default:
  //       break;
  //   }
  // }

  // onClick function
  // clickedNotification(notification: object){
  //   // mar notification as viewed
  //   this.db.markNotificationAsViewed(notification['notificationID'], this.user.getLoginToken()).then(_ => {
  //     // navigate to page according to notification
  //     switch (notification['type']) {
  //       case 'new transaction':
  //         // go to detail page of listing
  //         this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
  //         break;
  //       case 'cancellation':
  //         if (notification['transaction'].customerID === this.user.getId())
  //           // go to my transactions
  //           this.router.navigate(['/listings'], {queryParams: { transactions: true }})
  //         else
  //           // go to detail page of listing
  //           this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
  //         break;
  //       case 'payment confirmation':
  //       case 'reviewable':
  //         // go to my transactions
  //         this.router.navigate(['/listings'], {queryParams: { transactions: true }})
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  // }

  // get notifications and sort recent to last
  // fetchNotifications() {
  //   if (this.user.isLoggedIn())
  //     this.db.getUserNotifications(this.user.getLoginToken()).then(r => this.notifications = r['notifications'].sort((a, b) => b['notificationID'] - a['notificationID']))
  // }

  getUnreadNotificationsAmount(): number{
    return this.notifications.filter(x => !x['viewed']).length;
  }
}
