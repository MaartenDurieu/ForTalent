import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { idText } from 'typescript';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/transactions/popup/popup.component';
import { Popup2Component } from 'src/app/transactions/popup2/popup2.component';
import { Popup3Component } from 'src/app/transactions/popup3/popup3.component';
import { Popup4Component } from 'src/app/transactions/popup4/popup4.component';
import { Popup5Component } from 'src/app/transactions/popup5/popup5.component';
import { Popup6Component } from 'src/app/transactions/popup6/popup6.component';
import { Popup7Component } from 'src/app/transactions/popup7/popup7.component';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None // add this line
})
export class DetailComponent implements OnInit {

  public checkedMessage: boolean = false;
  listing: object;
  error: string;
  form:UntypedFormGroup;
  transactions = [];
  transactionsOutgoing = [];
  transactionsIncoming = [];
  filteredAwaiting = [];
  reviews = [];
  avgScore: number = 0;
  selectedTab = ""; // ["info", "reviews", "transactions"]
  loading = 0; // #asynchronous tasks running

  maker: object;
  makerID: number;
  genres = [];
  ArtistTypes = [];
  artistProposal: object;
  artistReceival: object;
  controlEditID;
  controlProposalID;

  venueAccount: boolean;
  artistAccount: boolean;
  editCheck: boolean;
  proposalCheck: boolean;

  Outgoing: boolean;
  Incoming: boolean;
  awaiting: boolean;
  reviewable: boolean;
  attchMessage: boolean =false;

  isLoading: boolean=true;

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public dialog: MatDialog,
    public image: ImageService,
    private ngZone: NgZone) {
      // initialize form field
      this.form = new UntypedFormGroup({
        suggestedPay: new UntypedFormControl(),
        message: new UntypedFormControl(),
        genre: new UntypedFormControl(),
        artistType: new UntypedFormControl()
      });
    }


  //"user.isLoggedIn() && listing.userID !== user.getId() && !artistProposal && !artistReceival && listing.status !== 'cancelled'"
  ngOnInit(): void {   
    this.transactionsOutgoing = [];
    this.transactionsIncoming = [];
    this.filteredAwaiting = [];
    this.editCheck=false;
    this.proposalCheck=false;
    //get url query params
    this.route.params.subscribe(params => {
      this.makerID=null;
      this.error = "";
      // when detail-type is given in url
      if (params.type && ["info", "reviews", "transactions"].includes(params.type))
        this.selectedTab = params.type;
      // get listingdata
      this.db.getListing(params.id).then(l => {this.listing=l;this.makerID=this.listing["userID"];
      this.genres = this.listing["genre"].split(",");
      if(this.listing["status"]=="Reviewable"){
        this.reviewable=true;}
      this.ArtistTypes = this.listing["artistType"].split(",");
      this.db.getUserData(this.makerID, this.user.getLoginToken())
      .then(user => {this.maker=user;
      // this.listing= Object.assign(this.listing,this.maker);
      this.db.getUserData(this.user.getId(), this.user.getLoginToken())
      .then(user => {
        Object.keys(user).forEach(x => {
          if (x === 'accountType'){
            if(user[x]==="Venue"){
              this.artistAccount=false;
              this.venueAccount= true;
              document.getElementById("formProposal").style.display = "none";
              this.db.getUserTransactionsL(this.user.getLoginToken()).then(t => {this.transactions = t["transactions"].filter(f => (f["listingID"]==params.id))});
            }else{
              this.artistAccount=true;
              this.db.getUserArtistTransactions(this.user.getLoginToken()).then(transactions => {
               for(var tr of transactions["transactions"]){
                if(tr["listingID"]===this.listing["listingID"] && tr["status"]=="ArtistProposal"){
                  console.log({tr:tr,listing:this.listing});
                  this.transactionsOutgoing.push(tr);
                  return;
                }else if(tr["listingID"]===this.listing["listingID"] && tr["status"]=="VenueProposal"){
                  this.transactionsIncoming.push(tr);
                  return;
                } else if(tr["listingID"]==this.listing["listingID"] && tr["status"]=="AwaitingPayment"){
                  this.filteredAwaiting.push(tr);
                  this.awaiting=true;
                  return;
                }
               }document.getElementById("formProposal").style.display = "block";
              })
            }}})}).then(u => {this.isLoading=false});
          
      })})});
    }
  
    activateEdit(transactionID, artistID: number, venueID: number, genre: string, artistType:string, suggestedPay: number, message){
      const dialogRef = this.dialog.open(Popup6Component, {data: {genre: genre, artistType: artistType, suggestedPay: suggestedPay, genreArray:this.genres, typesArray:this.ArtistTypes, message:message},panelClass: 'custom-modalbox'});
      dialogRef.afterClosed().subscribe(result => {
        if(result === null){
          return;
        }
        else{
          this.db.editProposal(transactionID, artistID,venueID,result.suggestedPay, result.message, result.genre, result.artistType);
          this.ngOnInit();
        }});
    }

    deleteProposal(listingID: number, artistID: number, venueID: number){
      this.db.NotificationsCancel(listingID, venueID, artistID);
      this.db.deleteProposals(listingID,artistID,venueID);
      document.getElementById("formProposal").style.display = "block";
      this.ngOnInit();
    }

    openNegotiation(listingID,transactionID, artistID: number, venueID: number, genre: string, artistType:string, suggestedPay: number){
      const dialogRef = this.dialog.open(Popup7Component, {data: {genre: genre, artistType: artistType, suggestedPay: suggestedPay, genreArray:this.genres, typesArray:this.ArtistTypes},panelClass: 'custom-modalbox'});
      dialogRef.afterClosed().subscribe(result => {
        if(result === null){
          return;
        }
        else{
          if(this.artistAccount===true){
            this.db.proposalToLog(transactionID,artistID,venueID, "HistoryV");
            this.db.addProposal(listingID,artistID,venueID,"ArtistProposal",result.suggestedPay, result.message,artistID,venueID,result.genre,result.artistType);
          }
          else{
            this.db.proposalToLog(transactionID,artistID,venueID, "HistoryA");
            this.db.addProposal(listingID,artistID,venueID,"VenueProposal",result.suggestedPay, result.message,artistID,venueID,result.genre,result.artistType);
          }
          this.ngOnInit();
        }});
    }
    openDialogDelete(listingID: number){
      const dialogRef = this.dialog.open(Popup5Component);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.deleteListing(listingID);
          this.router.navigateByUrl("/mylistings");
        }
      });
    }

    openDialog(finalpay: number, transactionID, listingID, artistID: number, venueID: number, suggestedPrice: number, genre:string, type:string){
      const dialogRef = this.dialog.open(PopupComponent, {data: {
        price: finalpay
      },panelClass: 'custom-modalbox'});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.acceptOffer(transactionID,listingID, artistID, venueID, suggestedPrice, genre, type);
        }
      });
    }

    openDialog2(finalpay: number, transactionID, listingID, artistID: number, venueID: number, suggestedPrice: number, genre:string, type:string){
      console.log(venueID);
      const dialogRef = this.dialog.open(Popup2Component, {data: {
        price: finalpay
      },panelClass: 'custom-modalbox'});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.acceptOffer(transactionID,listingID, artistID, venueID, suggestedPrice, genre, type);
        }
      });
    }

    openDialog3(finalpay: number, listingID, artistID: number, venueID: number){
      console.log(venueID);
      const dialogRef = this.dialog.open(Popup3Component, {data: {
        price: finalpay
      },panelClass: 'custom-modalbox'});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          if(this.artistAccount==true){
            this.db.postNotification(venueID,null,listingID,null,artistID,"rejectedNegotiation");}
          else if(this.venueAccount==true){
            this.db.postNotification(artistID,null,listingID,null,venueID,"rejectedNegotiation");}
          this.deleteProposal(listingID, artistID, venueID);
        }
      });
    }

    openDialog4(finalpay: number, listingID, artistID: number, venueID: number){
      const dialogRef = this.dialog.open(Popup4Component, {data: {
        price: finalpay
      },panelClass: 'custom-modalbox'});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          if(this.artistAccount==true){
          this.db.postNotification(venueID,null,listingID,null,artistID,"cancelledNegotiation");}
        else if(this.venueAccount==true){
          this.db.postNotification(artistID,null,listingID,null,venueID,"cancelledNegotiation");}
          this.deleteProposal(listingID, artistID, venueID);
        }
      });
    }

    openDialog5(message){
      const dialogRef = this.dialog.open(Popup5Component, {data: {
        message:message
      },panelClass: 'custom-modalbox'});
    }
  // when type was given, scroll to given type when all data is loaded
  onFinishLoading() {
    this.loading -= 1;
    if (this.loading !== 0) return;
    if (this.selectedTab)
      setTimeout(() => document.getElementById(this.selectedTab).scrollIntoView(), 50); // give time for transactions table to build
    else
      this.selectedTab = 'info';
  }
  // get reviews
  loadReviews(){
    this.loading += 1;
    this.db.getListingReviews(this.listing['listingID']).then(r => {
      this.avgScore = r['score'];
      this.reviews = r['reviews'];
      this.onFinishLoading();
    }).catch(err => this.error = err.error.message)
  }
  
  deleteListing(listingID: number){
    this.db.deleteListing(listingID).then(_ => {this.ngOnInit();})
  }

  // create transaction
  createTransaction(){
    // get form value
    let v = this.form.getRawValue()
    // add listingID to form values
    v['listingID'] = this.listing['listingID'];
    v['venueID']=this.listing["userID"];
    v["artistID"]=this.user.getId();
    v["receiverID"]=v["venueID"];
    v["senderID"]=this.user.getId();
    this.db.createTransaction(this.user.getLoginToken(), v);
    document.getElementById("formProposal").style.display = "none";
    this.ngOnInit();
    }

    acceptOffer(transactionID, listingID ,artistID: number, venueID: number, suggestedPrice: number, genre: string, type:string){
      this.db.acceptOfferListing(listingID, artistID,"AwaitingPayment", genre, type, suggestedPrice);
      this.db.acceptedProposal(transactionID,artistID,venueID,suggestedPrice).then( y => {
        this.db.deleteListingProposals(listingID);});
      if(this.artistAccount==true){
        this.db.postNotification(venueID,transactionID,listingID,null,artistID,"offerAccepted");}
      else if(this.venueAccount==true){
        this.db.postNotification(artistID,transactionID,listingID,null,venueID,"offerAccepted");}
      this.db.NotificationsRemove(listingID, "offerAccepted");
      this.ngOnInit();
    }

    makeProposal(transactionID, listingID: number, artistID: number, venueID: number, genre:string, artistType:string){
      if(this.proposalCheck==false){
        document.getElementById(transactionID).style.display = "block";
        this.controlProposalID=transactionID;
        this.proposalCheck = true;
      }else{
        var newProposal = parseFloat((<HTMLInputElement>document.getElementById("pay"+transactionID)).value);
        var newMessage = (<HTMLInputElement>document.getElementById("message"+transactionID)).value;
        if(newProposal!=null && newProposal>0 && transactionID== this.controlProposalID){
          if(this.artistAccount==true){
            this.db.proposalToLog(transactionID,artistID,venueID, "HistoryV");
            this.db.addProposal(listingID,artistID,venueID,"ArtistProposal",newProposal, newMessage,artistID,venueID,genre,artistType);}
          else if(this.venueAccount==true){
            this.db.proposalToLog(transactionID,artistID,venueID, "HistoryA");
            this.db.addProposal(listingID,artistID,venueID,"VenueProposal",newProposal, newMessage,venueID,artistID,genre,artistType);}
          this.ngOnInit();}
        else{
          document.getElementById(this.controlProposalID).style.display = "none";
          document.getElementById(transactionID).style.display = "block";
          this.controlProposalID=transactionID;}
      }
    }
  
  filteredVenueOutgoing = () => {
    if(this.transactions.filter(t => (t.status.includes("VenueProposal"))).length>0){
      this.Outgoing=true;}
    else{
      this.Outgoing=false;}
    return this.transactions.filter(t => (t.status.includes("VenueProposal")));}
  filteredVenueIncoming = () => {
    if(this.transactions.filter(t => (t.status.includes("ArtistProposal"))).length>0){
      this.Incoming=true;}
    else{
      this.Incoming=false;}
    return this.transactions.filter(t => (t.status.includes("ArtistProposal")));}

  filteredVenueAwaiting = () => {
    if(this.transactions.filter(t => (t.status.includes("AwaitingPayment"))).length>0){
      this.awaiting=true;}
    else{
      this.awaiting=false;}
    return this.transactions.filter(t => (t.status.includes("AwaitingPayment")));}  


  showMessageForm(){
    if((<HTMLInputElement>document.getElementById("yesMessage")).checked){
      document.getElementById("message").style.display = "block";
      this.attchMessage=true;

    }else{
      document.getElementById("message").style.display = "none";
      this.attchMessage=false;
    }
  }
  debugggg(){
    let tr = this.filteredVenueIncoming();
    console.log(this.transactionsOutgoing);
  }
  pay(listingID, artistID, venueID){
    this.db.deleteAwaiting(listingID);
    this.db.updateListingStatusAwaiting(listingID, artistID,"Filled");
    this.db.postNotification(artistID,null,listingID,null,venueID,"paymentReceived");
    this.db.NotificationsRemove(listingID, "paymentReceived");
    this.ngOnInit();
  }

  // confirm transaction payment
  confirmPayment(transactionId: number){
    this.db.confirmPayment(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      //this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }
}
