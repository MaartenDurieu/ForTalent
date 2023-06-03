import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DbConnectionService } from 'src/app/services/db-connection.service';

@Component({
  selector: 'app-profile-display',
  templateUrl: './profile-display.component.html',
  styleUrls: ['./profile-display.component.scss']
})
export class ProfileDisplayComponent implements OnInit {

  venueAccount: boolean;
  sameAccount: boolean;
  userID: number;
  conversationID: number;
  userAccount: object;
  isLoading: boolean=true;
  avgPay: number;
  genreCounts = {};
  artistCounts = {};
  topFiveGenres ={};
  topFiveTypes = {};
  reviews: Object[];

  writtenvis: boolean = true;
  bordervis: boolean = false;
  //vis
  infovis: boolean= true;
  calendarvis: boolean= false;
  reviewsvis: boolean= false;
  activeButton: string = 'info';

  receivedReviewAmount: number;
  receivedReview: Object[]=[];
  writeReviewBold;
  receivedReviewBold;

  categoryNames = ['onTime', 'professionalism', 'friendly', 'collaboration', 'music', 'originality', 'audience', 'experience', 'atmosphere', 'accomodation', 'acoustics', 'organisation', 'helpful']
  catscores;

  constructor(private route: Router, private ActivatedRoute: ActivatedRoute, private db: DbConnectionService, private user:UserService,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(params => {
      this.db.getUserData(params.id,this.user.getLoginToken())
    .then(user => {
      this.userAccount=user;
      if(user["accountType"]=="Venue"){this.venueAccount=true;}
      else{this.venueAccount=false;}
      if(user["userID"]==this.user.getId()){this.sameAccount=true;}
      else{this.sameAccount=false;}
    
    }).then(_ => {
      if(this.sameAccount){
      this.db.getUserNotifications(this.user.getLoginToken()).then(notifications => {
        this.receivedReviewAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="receivedReview")).length;
      this.receivedReview = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="receivedReview"));
      this.receivedReviewBold = this.receivedReview.map(a => a["reviewID"]);
      notifications["notifications"].filter(f => (f["viewed"]==0)
      && f["type"]=="receivedReview")
      .forEach(n=> {this.db.markNotificationAsViewed(n["notificationID"],this.user.getLoginToken());})
      })}
    }).then(_ => {
      if(this.venueAccount){
      this.db.getUserListings(params.id).then(listings => {
        const filteredListings =  listings['listings'].filter(obj => obj.status !== 'active')
        const sum = filteredListings.reduce((acc, obj) => acc + obj.suggestedPrice, 0);
        this.avgPay = sum / filteredListings.length;
        const genretempC = {};
        const typetempC={}
        filteredListings.forEach(listing => {
          if(listing.artistType in typetempC){
            typetempC[listing.artistType]++;
          } else {
            typetempC[listing.artistType] = 1;
          }
          this.artistCounts = Object.entries(typetempC).map(([type, count]) => ({ type, count }));
        });
        filteredListings.forEach(listing => {
          if(listing.genre in genretempC){
            genretempC[listing.genre]++;
          } else {
            genretempC[listing.genre] = 1;
          }
        this.genreCounts = Object.entries(genretempC).map(([genre, count]) => ({ genre, count }));
        });
      }).then(_ => {
      this.topFiveGenres = Object.entries(this.genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 5);
      this.topFiveTypes = Object.entries(this.artistCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, 5);
      });
    }
  else{
    this.db.getArtistListings(params.id).then(listings => {
      const filteredListings =  listings['listings'].filter(obj => obj.status !== 'active')
      const sum = filteredListings.reduce((acc, obj) => acc + obj.suggestedPrice, 0);
      this.avgPay = sum / filteredListings.length;
      const genretempC = {};
      const typetempC={}
      filteredListings.forEach(listing => {
        if(listing.artistType in typetempC){
          typetempC[listing.artistType]++;
        } else {
          typetempC[listing.artistType] = 1;
        }
        this.artistCounts = Object.entries(typetempC).map(([type, count]) => ({ type, count }));
      });
      filteredListings.forEach(listing => {
        if(listing.genre in genretempC){
          genretempC[listing.genre]++;
        } else {
          genretempC[listing.genre] = 1;
        }
      this.genreCounts = Object.entries(genretempC).map(([genre, count]) => ({ genre, count }));
      });
    }).then(_ => {
    this.topFiveGenres = Object.entries(this.genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 5);
    this.topFiveTypes = Object.entries(this.artistCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => Number(b.count) - Number(a.count))
    .slice(0, 5);
    })
  }}).then(_ => {
    this.db.getReceivedReviews(params.id).then(review => {this.reviews = [review['review']][0]; console.log(this.reviews)})
  }).then(_ => {
    for(let cat in this.categoryNames){
      let total = 0;
      let score = 0;
    // Loop over the objects in the array and compute the total and score for this category
    for (let obj of this.reviews) {
        if(obj[cat] > 0){
        total += 5;
        score += obj[cat];
        }
    }
    // Compute the progress percentage for this category
    if(total > 0){
      this.catscores.push({cat:Math.round((score / total) * 100)})
    }
    }
  });
  })
  setTimeout(() => {
    this.ngZone.run(() => {
      this.isLoading = false;
    });
  }, 2000);
  }


  sendMessage(){
    if(this.conversationID>0){
      //route to the conversation
      this.route.navigate(['/messages'],{ queryParams: {conversationID: this.conversationID}});
    }else {
      //make the conversation and route to it
      this.db.createConversation(this.user.getId(),this.userID)
      .then(c => {this.route.navigate(['/messages'],{ queryParams: {conversationID: c["conversationID"]}});})
    }
  }

  followAccount(){
    this.db.followAccount(this.userID, this.user.getId());
  }

  toggleDetails(rc){
    rc.showDetails = !rc.showDetails
    rc.bordervis  = !rc.bordervis 
  }

  showTab(tab: string){
    if(tab==='Reviews'){
      this.reviewsvis=true;
      this.activeButton='reviews';

      this.calendarvis=false;
      this.infovis=false;
    }
    else if (tab==='Calendar'){
      this.calendarvis=true;
      this.activeButton='calendar';

      this.infovis=false;
      this.reviewsvis=false;
    }
    else{
      this.infovis=true;
      this.activeButton='info';

      this.calendarvis=false;
      this.reviewsvis=false;
    }
  }

  getProgressPercentage(category: string): number {
    let total = 0;
    let score = 0;
    // Loop over the objects in the array and compute the total and score for this category
    for (let obj of this.reviews) {
        if(obj[category] > 0){
        total += 5;
        score += obj[category];
        }
    }
    // Compute the progress percentage for this category
    if(total === 0){
      return 0;
    }
    return Math.round((score / total) * 100);
  }

  getProgressCategories(): string[] {
    const progressCategories: string[] = [];
  
    for (let category of this.categoryNames) {
      if(this.getProgressPercentage(category) > 0){
        progressCategories.push(category);
      }
    }
    return progressCategories;
  }
  
 
}
