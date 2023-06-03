import { Component, OnInit, Input, SimpleChanges, NgZone  } from '@angular/core';
import { User, UserService } from '../services/user.service';
import { DbConnectionService } from '../services/db-connection.service';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { ListingsComponent } from '../listings/listings.component';
import { PopupComponent } from './popup/popup.component';
import { Popup2Component } from './popup2/popup2.component';
import { Popup3Component } from './popup3/popup3.component';
import { Popup4Component } from './popup4/popup4.component';
import { Popup7Component } from './popup7/popup7.component';
import { Popup6Component } from './popup6/popup6.component';
import { Popup5Component } from './popup5/popup5.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  clickedCancelled: boolean=false;
  clickedDeleted: boolean=false;

  incomingPropAmount: number = 0;
  incomingProp: Object[] = [];
  rejectedCancelledAmount: number = 0;
  rejectedCancelled: Object[] = [];
  offerAcceptedAmount: number = 0;
  offerAccepted: Object[] = [];
  deletedListingAmount: number = 0;
  deletedListing: Object[] = [];

  incomingPropBold: number[] = [];
  offerAcceptedBold: number[] = [];

  transactions = [];
  userCheck: Object;
  editCheck: boolean;
  proposalCheck: boolean;
  venueAccount: boolean;
  awaiting: boolean;
  artistAccount: boolean;
  controlEditID;
  controlProposalID;

  isLoading: boolean = true;

  incomingvis: boolean = true;
  outgoingvis: boolean = true;
  awaitingvis: boolean = true;

  constructor(private db: DbConnectionService,
    private user: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private ngZone: NgZone) {}

    openDialog5(message){
      const dialogRef = this.dialog.open(Popup5Component, {data: {
        message:message
      },panelClass: 'custom-modalbox'});
    }

    openNegotiation(listingID,transactionID, artistID: number, venueID: number, genre: string, artistType:string, suggestedPay: number, genres, types){
      const dialogRef = this.dialog.open(Popup7Component, {data: {genre: genre, artistType: artistType, suggestedPay: suggestedPay, genreArray:genres.split(","), typesArray:types.split(",")},panelClass: 'custom-modalbox'});
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

  openDialog(finalpay: number, transactionID, listingID , artistID: number, venueID: number, suggestedPrice:number, genre:string, type:string){
    const dialogRef = this.dialog.open(PopupComponent, {data: {
      price: finalpay
    }});

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.acceptOffer(transactionID, listingID, artistID, venueID, suggestedPrice, genre,type);
      }
    });
  }

  openDialog2(finalpay: number, transactionID, listingID, artistID: number, venueID: number, suggestedPrice: number, genre:string, type:string){
    const dialogRef = this.dialog.open(Popup2Component, {data: {
      price: finalpay
    }});

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.acceptOffer(transactionID, listingID, artistID, venueID, suggestedPrice, genre, type);
      }
    });
  }

  openDialog3(finalpay: number, listingID: number, artistID: number, venueID: number){
    const dialogRef = this.dialog.open(Popup3Component, {data: {
      price: finalpay
    }});

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        if(this.artistAccount==true){
          this.db.postNotification(venueID,null,listingID,null,artistID,"rejectedNegotiation");}
        else if(this.venueAccount==true){
          this.db.postNotification(artistID,null,listingID,null,venueID,"rejectedNegotiation");}
        this.deleteAllProposals(listingID, artistID, venueID);
      }
    });
  }

  

  openDialog4(finalpay: number, listingID, artistID: number, venueID: number){
    const dialogRef = this.dialog.open(Popup4Component, {data: {
      price: finalpay
    }});

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        if(this.artistAccount==true){
          this.db.postNotification(venueID,null,listingID,null,artistID,"cancelledNegotiation");}
        else if(this.venueAccount==true){
          this.db.postNotification(artistID,null,listingID,null,venueID,"cancelledNegotiation");}
        this.deleteAllProposals(listingID, artistID, venueID);
      }
    });
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.controlEditID=null;
    this.controlProposalID=null;
    this.proposalCheck=false;
    this.editCheck=false;
    this.venueAccount=null;
    this.artistAccount=null;
    this.db.getUserData(this.user.getId(),this.user.getLoginToken()).then(u => {
      if(u['accountType']==="Venue"){
        this.venueAccount=true;
        this.db.getUserTransactionsL(this.user.getLoginToken()).then(t => {this.transactions = t["transactions"];})
      }else{
        this.artistAccount=true;
        this.db.getUserArtistTransactionsL(this.user.getLoginToken()).then(t => {this.transactions = t["transactions"];})
      }  
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isLoading = false;
        });
      }, 3000);
    });

    //Notifications
    this.db.getUserNotificationsMergedALL(this.user.getLoginToken()).then(notifications => {
      //Amount of notifications for each possible outcome
      this.incomingPropAmount = notifications["notifications"].filter(f => (f["viewed"]==0)&&(f["type"]=="incomingProp")).length;
      this.incomingProp= notifications["notifications"].filter(f => (f["viewed"]==0)&&(f["type"]=="incomingProp"));
      this.incomingPropBold = this.incomingProp.map(a => a["transactionID"]);

      this.rejectedCancelledAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="cancelledNegotiation"||f["type"]=="rejectedNegotiation")).length;
      this.rejectedCancelled = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="cancelledNegotiation"||f["type"]=="rejectedNegotiation"));
      console.log(this.rejectedCancelled);

      this.offerAcceptedAmount = notifications["notifications"].filter(f => (f["viewed"]==0)&&(f["type"]=="offerAccepted")).length;
      this.offerAccepted = notifications["notifications"].filter(f => (f["viewed"]==0)&&(f["type"]=="offerAccepted"));
      this.offerAcceptedBold = this.offerAccepted.map(a => a["transactionID"]);

      this.deletedListingAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="deletedListing"||(f["type"]=="expiredListing"&&f["accountID"]!=null))).length;
      this.deletedListing = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="deletedListing"||(f["type"]=="expiredListing"&&f["accountID"]!=null)));

      //marks all relevant notifications as viewed
      notifications["notifications"].filter(f => (f["viewed"]==0)
        &&(f["type"]=="incomingProp"||f["type"]=="rejectedNegotiation"||f["type"]=="offerAccepted"
        ||f["type"]=="cancelledNegotiation"||f["type"]=="deletedListing"))
        .forEach(n=> {this.db.markNotificationAsViewed(n["notificationID"],this.user.getLoginToken());})
    });
  }

  clickDeleted(){
    if(this.clickedDeleted==false){
      this.clickedDeleted=true;}
    else if(this.clickedDeleted==true){
      this.clickedDeleted=false;}
  }

  clickCancelled(){
    if(this.clickedCancelled==false){
      this.clickedCancelled=true;}
    else if(this.clickedCancelled==true){
      this.clickedCancelled=false;}
  }


  filteredArtistIncoming = () => {
    return this.transactions.filter(t => (t.status.includes("VenueProposal")));}
  filteredArtistOutgoing = () => {
    return this.transactions.filter(t => (t.status.includes("ArtistProposal")));}

  filteredVenueOutgoing = () => {
    return this.transactions.filter(t => (t.status.includes("VenueProposal")));}
  filteredVenueIncoming = () => {
    return this.transactions.filter(t => (t.status.includes("ArtistProposal")));}

  filteredAwaiting = () => {
    if(this.transactions.filter(t => (t.status.includes("AwaitingPayment"))).length>0){
      this.awaiting=true;
    }else{
      this.awaiting=false;}
    return this.transactions.filter(t => (t.status.includes("AwaitingPayment")));}

  acceptOffer(transactionID, listingID: number, artistID: number, venueID: number, suggestedPrice: number, genre:string, type:string){
    this.db.acceptOfferListing(listingID, artistID,"AwaitingPayment",genre,type, suggestedPrice);
    this.db.acceptedProposal(transactionID,artistID,venueID, suggestedPrice).then( y => {
      this.db.deleteListingProposals(listingID);});
    if(this.artistAccount==true){
      this.db.postNotification(venueID,transactionID,listingID,null,artistID,"offerAccepted");}
    else if(this.venueAccount==true){
      this.db.postNotification(artistID,transactionID,listingID,null,venueID,"offerAccepted");}
    this.db.NotificationsRemove(listingID, "offerAccepted");
    this.ngOnInit();
  }

  pay(listingID, artistID, venueID){
    this.db.deleteAwaiting(listingID);
    this.db.updateListingStatusAwaiting(listingID, artistID,"Filled");
    this.db.postNotification(artistID,null,listingID,null,venueID,"paymentReceived");
    this.db.NotificationsRemove(listingID, "paymentReceived");
    this.ngOnInit();
  }
  makeProposal(transactionID, listingID: number, artistID: number, venueID: number, genre: string, artistType: string){
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
          this.db.addProposal(listingID,artistID,venueID,"ArtistProposal",newProposal, newMessage,artistID,venueID, genre, artistType);}
        else if(this.venueAccount==true){
          this.db.proposalToLog(transactionID,artistID,venueID, "HistoryA");
          this.db.addProposal(listingID,artistID,venueID,"VenueProposal",newProposal, newMessage,venueID,artistID, genre, artistType);}
        this.ngOnInit();
      }
      else{
        document.getElementById(this.controlProposalID).style.display = "none";
        document.getElementById(transactionID).style.display = "block";
        this.controlProposalID=transactionID;}
    }
  }

  // activateEdit(transactionID, artistID: number, venueID: number){
  //   if(this.editCheck==false){
  //     document.getElementById(transactionID).style.display = "block";
  //     this.controlEditID=transactionID;
  //     this.editCheck = true;}
  //   else{
  //       var newSuggested = parseFloat((<HTMLInputElement>document.getElementById("pay"+transactionID)).value);
  //       var newMessage = (<HTMLInputElement>document.getElementById("message"+transactionID)).value;
  //     if(newSuggested >0 && newSuggested!=null && this.controlEditID==transactionID){
  //       // this.db.editProposal(transactionID, artistID,venueID,newSuggested, newMessage);
  //       this.ngOnInit();}
  //     else{
  //       document.getElementById(this.controlEditID).style.display = "none";
  //       document.getElementById(transactionID).style.display = "block";
  //       this.controlEditID=transactionID;}
  //   }
  // }

  activateEdit(transactionID, artistID: number, venueID: number, genre: string, artistType:string, suggestedPay: number, message, genres, types){
    const dialogRef = this.dialog.open(Popup6Component, {data: {genre: genre, artistType: artistType, suggestedPay: suggestedPay, genreArray:genres.split(","), typesArray:types.split(","), message:message},panelClass: 'custom-modalbox'});
    dialogRef.afterClosed().subscribe(result => {
      if(result === null){
        return;
      }
      else{
        this.db.editProposal(transactionID, artistID,venueID,result.suggestedPay, result.message, result.genre, result.artistType);
        this.ngOnInit();
      }});
  }
  
  deleteAllProposals(listingID: number, artistID: number, venueID: number){
    this.db.NotificationsCancel(listingID, venueID, artistID);
    this.db.deleteProposals(listingID,artistID,venueID);
    this.ngOnInit();
  }

  toggleIncoming(){
    this.incomingvis = !this.incomingvis;
  }

  toggleOutgoing(){
    this.outgoingvis = !this.outgoingvis;
  }

  toggleAwaiting(){
    this.awaitingvis = !this.awaitingvis;
  }
}
