import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { UntypedFormControl, UntypedFormGroup,Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { idText } from 'typescript';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements OnInit, OnChanges {

  listingID;
  artistID: number;
  venueID: number;
  txtRateValue = 0;
  venueAccount: boolean;
  artistAccount: boolean;
  form: UntypedFormGroup;

  //Review scores about an artist
  onTimeScore: number;
  professionalismScore: number;
  musicScore: number;
  originalityScore: number;
  collaborationScore: number;
  //Review score about a venue
  atmosphereScore: number;
  accomodationScore: number;
  acousticsScore: number;
  organisationScore: number;
  helpfulScore: number;
  //Shared review scores
  friendlyScore: number;
  audienceScore: number;
  experienceScore: number;

  isLoading: boolean;
  userscore : number;
  listingIdentifier: number;
  listingStatus: string;
  myInput: string;
  listing: object;
  reviewe: object;

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public image: ImageService) { 
      this.form = new UntypedFormGroup({
        onTime: new UntypedFormControl(),
        professionalism: new UntypedFormControl(),
        friendly: new UntypedFormControl(),
        collaboration: new UntypedFormControl(),
        music: new UntypedFormControl(),
        originality: new UntypedFormControl(),
        audience: new UntypedFormControl(),
        experience: new UntypedFormControl(),
        reviewText: new UntypedFormControl(),
        atmosphere: new UntypedFormControl(),
        accomodation: new UntypedFormControl(),
        acoustics: new UntypedFormControl(),
        organisation: new UntypedFormControl(),
        helpful: new UntypedFormControl(),
      })
    }

  loadingOK() {
    this.isLoading=false;
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.venueAccount=false;
    this.artistAccount=false;
    this.route.params.subscribe(params => {this.listingID=params["id"];
      this.db.getListing(this.listingID).then(l =>{this.artistID= l["artistID"];this.listing=l; this.venueID= l["userID"];this.listingStatus=l["status"];}).then(_ => {
        this.db.getUserData(this.user.getId(), this.user.getLoginToken()).then(user => {if(user["accountType"]==="Venue"){
          this.venueAccount=true;
          this.db.getUserData(this.artistID, this.user.getLoginToken()).then(artist => {this.userscore = artist["reviewScore"]; this.reviewe=artist;})
      }else{
        this.artistAccount=true;
        this.db.getUserData(this.venueID, this.user.getLoginToken()).then(venue => {this.userscore = venue["reviewScore"]; this.reviewe=venue;})
      };}); 
      }).then(__ => {this.isLoading=false;})});
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  submitReview(){
    let v = this.form.getRawValue();
    let avgScore:number=0;
    for(const score in v){
      if(typeof(v[score])=="number"){
        avgScore = avgScore +v[score];
      }
    }
    //Both artists and venues have 8 different review criteria 
    avgScore = avgScore/8;
    v["avgScore"]=avgScore;
    if(this.artistAccount==true){
      v["receiverID"]=this.venueID;
      v["writerID"]=this.artistID;
    }else if(this.venueAccount==true){
      v["receiverID"]=this.artistID;
      v["writerID"]=this.venueID;
    }
    v["listingID"]=parseInt(this.listingID, 10);
    this.db.postReview(this.user.getLoginToken(),v);

    if(this.userscore==null){
      //db update with avgScore
      if(this.venueAccount){
        this.db.changeReviewScore(this.artistID,avgScore);
        if(this.listingStatus=="ArtistReviewed"){
          this.db.updateListingStatusReviewed(this.listingID, "Completed")
        }else{
        this.db.updateListingStatusReviewed(this.listingID, "VenueReviewed")
        }
      }
      else{
        this.db.changeReviewScore(this.venueID,avgScore);
        if(this.listingStatus=="VenueReviewed"){
          this.db.updateListingStatusReviewed(this.listingID, "Completed")
        }else{
        this.db.updateListingStatusReviewed(this.listingID, "ArtistReviewed")
        }
      }
    }
    else{
      //db update with (avgScore+userscore)/2
      if(this.venueAccount){
        this.db.changeReviewScore(this.artistID,(avgScore+this.userscore)/2);
        if(this.listingStatus=="ArtistReviewed"){
          // this.db.updateListingStatusReviewed(this.listingID, "Completed")
        }else{
        // this.db.updateListingStatusReviewed(this.listingID, "VenueReviewed")
        }
      }
      else{
        this.db.changeReviewScore(this.venueID,(avgScore+this.userscore)/2);
        this.db.changeReviewScore(this.venueID,avgScore);
        if(this.listingStatus=="VenueReviewed"){
          this.db.updateListingStatusReviewed(this.listingID, "Completed")
        }else{
        this.db.updateListingStatusReviewed(this.listingID, "ArtistReviewed")
        }
      }
    }
    //this.db.updateListingStatusAwaiting(this.listingID,this.artistID,"Completed");
    this.router.navigateByUrl("/reviews");
  }
}
