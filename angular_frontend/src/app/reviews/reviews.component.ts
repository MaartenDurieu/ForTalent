import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { idText } from 'typescript';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  reviewableListings=[];
  venueAccount: boolean;
  artistAccount: boolean;

  writeReviewAmount: number;
  writeReview: Object[]=[];
  receivedReviewAmount: number;
  receivedReview: Object[]=[];
  writeReviewBold;
  receivedReviewBold;

  incomingvis: boolean = true;
  writtenvis: boolean = true;
  detailsvis: boolean = true;
  bordervis: boolean = false;

  isLoading: boolean = true;

  writtenReviews: Object[]=[];

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public image: ImageService,
    private ngZone: NgZone) { }
  
  ngOnInit(): void {
    this.db.getUserData(this.user.getId(), this.user.getLoginToken())
    .then(user => {
      this.db.getWrittenReviews(this.user.getId()).then(l => {this.writtenReviews=l["review"];})
      Object.keys(user).forEach(x => {
        if (x === 'accountType'){
          if(user[x]==="Venue"){
            this.venueAccount=true;
            this.db.getArtistMergedListings(this.user.getId()).then(l => {this.reviewableListings = l["listings"]; });
          }
          else{
            this.venueAccount=false;
            this.artistAccount=true;
            this.db.getVenueMergedListings(this.user.getId()).then(l => {this.reviewableListings = l["listings"];});
          }
        }
      })});
    
    this.db.getUserNotifications(this.user.getLoginToken()).then(notifications => {
      this.writeReviewAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="writeReview")).length;
      this.writeReview = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="writeReview"));
      this.writeReviewBold = this.writeReview.map(a => a["listingID"]);

      this.receivedReviewAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="receivedReview")).length;
      this.receivedReview = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="receivedReview"));
      this.receivedReviewBold = this.receivedReview.map(a => a["reviewID"]);

      //marks all relevant notifications as viewed
      notifications["notifications"].filter(f => (f["viewed"]==0)
      && f["type"]=="writeReview")
      .forEach(n=> {this.db.markNotificationAsViewed(n["notificationID"],this.user.getLoginToken());})
    });  
    setTimeout(() => {
      this.ngZone.run(() => {
        this.isLoading = false;
        console.log(this.writtenReviews)
      });
    }, 5000);
  }
  
  filteredReviewable(){
    if(this.venueAccount){
      return this.reviewableListings.filter(t => (t.status.includes("Reviewable")||t.status.includes("ArtistReviewed")));
    }
    return this.reviewableListings.filter(t => (t.status.includes("Reviewable")||t.status.includes("VenueReviewed")));
  }

  toggleIncoming(){
    this.incomingvis = !this.incomingvis;
  }

  toggleWritten(){
    this.writtenvis = !this.writtenvis;
  }

  toggleDetails(rc){
    rc.showDetails = !rc.showDetails
    rc.bordervis  = !rc.bordervis 
  }


}
