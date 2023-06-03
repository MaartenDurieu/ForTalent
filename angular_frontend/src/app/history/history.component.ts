import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { idText } from 'typescript';
import { Popup4Component } from '../transactions/popup4/popup4.component';
import { Popup2Component } from '../transactions/popup2/popup2.component';
import { PopupComponent } from '../transactions/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Popup3Component } from '../transactions/popup3/popup3.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  proposalCheck: boolean;
  editCheck: boolean;

  venueProposal: object;
  artistProposal: object;

  artistAccount: boolean;
  venueAccount: boolean;

  incoming: boolean;
  outgoing: boolean;

  transactions = [];
  artistID: number;
  venueID: number;

  controlEditID;
  controlProposalID;

  isLoading: boolean;

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public image: ImageService,
    public dialog: MatDialog) {}



    openDialog(finalpay: number, transactionID, listingID , artistID: number, venueID: number, suggestedPrice: number){
      const dialogRef = this.dialog.open(PopupComponent, {data: {
        price: finalpay
      }});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.acceptOffer(transactionID, listingID, artistID, venueID, suggestedPrice);
        }
      });
    }
  
    openDialog2(finalpay: number, transactionID, listingID, artistID: number, venueID: number, suggestedPrice: number){
      console.log(venueID);
      const dialogRef = this.dialog.open(Popup2Component, {data: {
        price: finalpay
      }});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.acceptOffer(transactionID, listingID, artistID, venueID, suggestedPrice);
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
            this.db.postNotification(venueID,null,listingID,null,artistID,"rejectedNegotiation");
          }
          else if(this.venueAccount==true){
            this.db.postNotification(artistID,null,listingID,null,venueID,"rejectedNegotiation");
          }
          this.db.NotificationsCancel(listingID, venueID, artistID);
          this.deleteProposal(listingID, artistID, venueID);
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
            this.db.postNotification(venueID,null,listingID,null,artistID,"cancelledNegotiation");
          }
          else if(this.venueAccount==true){
            this.db.postNotification(artistID,null,listingID,null,venueID,"cancelledNegotiation");
          }
          //Delete all unviewed notifications
          this.db.NotificationsCancel(listingID, venueID, artistID);
          this.deleteProposal(listingID, artistID, venueID);
        }
      });
    }
  ngOnInit(): void {
    this.isLoading=true;
    this.incoming=false;
    this.outgoing=false;
    this.artistProposal=null;
    this.venueProposal=null;
    this.editCheck=false;
    this.proposalCheck=false;
    this.db.getUserData(this.user.getId(), this.user.getLoginToken())
      .then(user => {
        Object.keys(user).forEach(x => {
          if (x === 'accountType'){
            if(user[x]==="Venue"){
              this.artistAccount=false;
              this.venueAccount=true;
            }else{
              this.artistAccount=true;
              this.venueAccount=false;}}})})
    .then(_ => {
    this.route.queryParams.subscribe(params => {
      this.artistID = params['a'];
      this.venueID = params['v'];
      this.db.getListingTransactionsCheck(params["l"],this.user.getLoginToken()).then(t => {
        this.transactions = t["transactions"];
        for(var tr of this.transactions){
          if(tr.status.includes("ArtistProposal")){
            this.artistProposal=tr;
            if(this.venueAccount==true){
              this.incoming=true;
            }else if (this.artistAccount==true){
              this.outgoing=true;
            }
          }else if(tr.status.includes("VenueProposal")){
            console.log({venueAcc: this.venueAccount, artistAcc: this.artistAccount});
            this.venueProposal=tr;
            if(this.artistAccount==true){
              this.incoming=true;
            }else if(this.venueAccount==true){
              this.outgoing=true;
            }
          }
        }});})}).then(___ => {this.isLoading=false;})
    }

    logger(){
      console.log({incoming: this.incoming, outgoing: this.outgoing, venueProposal: this.venueProposal, artistProposal: this.artistProposal,
      artistAcc: this.artistAccount, venueAcc: this.venueAccount});
    }


    debugger(){
      console.log(this.transactions.filter(t => (t.artistID==this.artistID, t.venueID==t.venueID, (t.status=="HistoryA"))));
    }
  filteredArtistProposals = () => {
    return this.transactions.filter(t => (t.artistID==this.artistID, t.venueID==t.venueID, (t.status=="HistoryA")));}
  filteredVenueProposals = () => {
    return this.transactions.filter(t => (t.artistID==this.artistID, t.venueID==t.venueID, (t.status=="HistoryV")));}  
    
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
            this.db.addProposal(listingID,artistID,venueID,"ArtistProposal",newProposal, newMessage,artistID,venueID, genre, artistType);
            this.ngOnInit()}
          else if(this.venueAccount==true){
            this.db.proposalToLog(transactionID,artistID,venueID, "HistoryA");
            this.db.addProposal(listingID,artistID,venueID,"VenueProposal",newProposal, newMessage,venueID,artistID,genre, artistType);}
            this.ngOnInit();}
        else{
          document.getElementById(this.controlProposalID).style.display = "none";
          document.getElementById(transactionID).style.display = "block";
          this.controlProposalID=transactionID;}
      }
    }

    activateEdit(transactionID, artistID: number, venueID: number){
      if(this.editCheck==false){
      document.getElementById(transactionID).style.display = "block";
      this.controlEditID = transactionID;
      this.editCheck = true;}
      else{
        var newSuggested = parseFloat((<HTMLInputElement>document.getElementById("pay"+transactionID)).value);
        var newMessage = (<HTMLInputElement>document.getElementById("message"+transactionID)).value;
        if(newSuggested >0 && newSuggested!=null && this.controlEditID==transactionID){
          //this.db.editProposal(transactionID, artistID,venueID,newSuggested, newMessage);
          this.ngOnInit()}
        else{
          document.getElementById(this.controlEditID).style.display = "none";
          document.getElementById(transactionID).style.display = "block";
          this.controlEditID=transactionID;}
      }
    }

    deleteProposal(listingID: number, artistID: number, venueID: number){
      this.db.deleteProposals(listingID,artistID,venueID);
      this.router.navigateByUrl("/transactions/userArtist?transactions=true");
    }

    acceptOffer(transactionID, listingID: number, artistID: number, venueID: number, suggestedPrice:number){
      this.db.updateListingStatusAwaiting(listingID, artistID,"AwaitingPayment");
      this.db.acceptedProposal(transactionID,artistID,venueID, suggestedPrice).then( y => {
        this.db.deleteListingProposals(listingID);});
      if(this.artistAccount==true){
        this.db.postNotification(venueID,transactionID,listingID,null,artistID,"offerAccepted");}
      else if(this.venueAccount==true){
        this.db.postNotification(artistID,transactionID,listingID,null,venueID,"offerAccepted");}
      this.db.NotificationsRemove(listingID, "offerAccepted");
      this.router.navigateByUrl("/transactions/userArtist?transactions=true");
    }
}
