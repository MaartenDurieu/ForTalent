import { Time } from '@angular/common';
import { Component, NgModule, OnInit,Renderer2 } from '@angular/core';
import { NgModel, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatCalendarCell } from '@angular/material/datepicker';
import { SelectMultipleComponent } from '../select-multiple/select-multiple.component';


/**
 *  Component is used to display listings or transactions
 */
//https://www.npmjs.com/package/ng-multiselect-dropdown
@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
})



export class ListingsComponent implements OnInit {
  startIndex:number = 0;
  displayCount = 8;
  listings = [];
  transactions: boolean = false; // true ->  display transactionInfo; false -> display listingInfo
  selectedOption: string;
  order:string;
  makers = [];
  isloading: boolean=true;

  genres = ["Alternative","Blues","Classical","Country","Electronic","Experimental","Instrumental","Jazz","Latin","Rap", "R&B","Rock","Urban"];
  artistTypes = ["Singer","DJ","Band"];

  activeListings: boolean = true; // show only active listings
  hasCancelled: boolean = false;

  selected: Date | null; // calendar value
  selectedStart: Time | null; // start time
  selectedEnd: Time | null; // end time

  displayDiv = false;

  toggleDisplay() {
    this.displayDiv = !this.displayDiv;
  }

  handleOrderSelected(selectedIndex: string) {
    this.sortCol = this.sortCols.findIndex(col => col.name === selectedIndex);
  }

  handleGenresSelected(selectedOption) {
    this.selectedItems = selectedOption
    // Perform any desired actions with the selected option
  }

  handleTypesSelected(selectedOption) {
    this.selectedItemsTypes = selectedOption
    // Perform any desired actions with the selected option
  }

  filteredlistings = this.listings;

  // searchbar + sorting
  searchTerm: string = ""; // searchbar value
  sortCol: number = 0; // sort dropdown index value
  sortCols = [ // sort dropdown values + sort functions
    {
      name: 'Most Recent',
      sortFunc: (a, b) => (a.date ? a.date : "").localeCompare(b.date ? b.date : "")
    }, {
      name: 'Highest Pay',
      sortFunc: (a, b) => b.suggestedPrice - a.suggestedPrice
    }, {
      name: 'Lowest Pay',
      sortFunc: (a, b) => a.suggestedPrice - b.suggestedPrice
    }, {
      name: 'Best Reviewed',
      sortFunc: (a, b) => b.reviewScore - a.reviewScore
    }];

    filled: boolean=false;
    
  // review
  form: UntypedFormGroup;
  selectedTransactionForReview: number = -1;
  rating: number = 0; // selected rating for review
  hoverRating: number = 0; // rating shown when hovering

  // pages
  pageLimitOption = [10, 20, 50]
  pageLimitIndex = 1; // selected pageLimit index
  currentPage = 1;

  // lambda function that calculates last page
  maxPage = (listings) => Math.ceil(listings.length / this.pageLimitOption[this.pageLimitIndex])

  // function that filters by category and searchTerm and sorts entries using searchCols
  filteredListings = () => {
    if(this.selectedItems.length===0 && this.selectedItemsTypes.length===0){
      return this.listings
      .filter(l => l.reviewScore >= this.requiredReviewScore || this.requiredReviewScore == -1)
      .filter(l => !this.selectedStart || this.selectedStart <= l.startTime)
      .filter(l => !this.selectedEnd || this.selectedEnd >= l.endTime)
      .filter(l => l.suggestedPrice >= this.selectedPay)
      .filter(l => l.status == "active" ) // filter only active listings
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0)))// when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
    }
    else if (this.selectedItems.length>0 && this.selectedItemsTypes.length===0){
      return this.listings
      .filter(l => l.reviewScore >= this.requiredReviewScore || this.requiredReviewScore == -1)
      .filter(l => this.selectedItems.some(g => l.genre.includes(g))) 
      .filter(l => !this.selectedStart || this.selectedStart <= l.startTime)
      .filter(l => !this.selectedEnd || this.selectedEnd >= l.endTime)
      .filter(l => l.suggestedPrice >= this.selectedPay)
      .filter(l => l.status == "active" ) // filter only active listings
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0)))// when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
    }
    else if (this.selectedItems.length===0 && this.selectedItemsTypes.length>0){
      return this.listings
      .filter(l => l.reviewScore >= this.requiredReviewScore || this.requiredReviewScore == -1)
      .filter(l => this.selectedItemsTypes.some(t => l.artistType.includes(t))) 
      .filter(l => !this.selectedStart || this.selectedStart <= l.startTime)
      .filter(l => !this.selectedEnd || this.selectedEnd >= l.endTime)
      .filter(l => l.suggestedPrice >= this.selectedPay)
      .filter(l => l.status == "active" ) // filter only active listings
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0)))// when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
    }
    else{
      return this.listings
      .filter(l => l.reviewScore >= this.requiredReviewScore || this.requiredReviewScore == -1)
      .filter(l => this.selectedItems.some(g => l.genre.includes(g))) 
      .filter(l => this.selectedItemsTypes.some(t => l.artistType.includes(t))) 
      .filter(l => !this.selectedStart || this.selectedStart <= l.startTime)
      .filter(l => !this.selectedEnd || this.selectedEnd >= l.endTime)
      .filter(l => l.suggestedPrice >= this.selectedPay)
      .filter(l => l.status == "active" ) // filter only active listings
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0)))// when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
    }
  }

  selectedPay: number=0;

  showFilterPane: boolean = false;
  toggleFilterPane(){
    this.showFilterPane = !this.showFilterPane;
    this.filled = !this.filled;
  }
  numbers: number[] = [0, 1, 2, 3, 4, 5];
  requiredReviewScore: number = -1;

  onButtonClick(number: number) {
      if (this.requiredReviewScore === number) {
        this.requiredReviewScore = -1;
      } else {
        this.requiredReviewScore = number; 
      }
    }
isLoading:boolean = true;
    sortColNames: string[];
  constructor(private db: DbConnectionService,
    private renderer: Renderer2,
    private appComponent: AppComponent,
    public user: UserService,
    private route: ActivatedRoute,
    public image: ImageService,
    public router: Router) {
      this.sortColNames = this.sortCols.map(col => col.name);
      this.form = new UntypedFormGroup({
        comment: new UntypedFormControl('')
      });
     }
     showCreate:boolean=false;
  broer: Object;
  dropdownList = [];
  dropdownListTypes=[];
  selectedItems = [];
  selectedItemsTypes=[];
  dropdownSettings = {};
  ngOnInit(): void {
    this.dropdownList = [
      'Alternative',
      'Blues',
      'Country',
      'Electronic',
      'Instrumental',
      'Jazz',
      'Latin',
      'Rap',
      'R&B',
      'Rock',
      'Urban' 
    ];
    this.dropdownListTypes = [
      'Singer',
      'Band',
      'DJ'
    ];
    this.selectedItems = [
    ];
    this.selectedItemsTypes = [
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
    

      // get user data
      this.db.getUserData(this.user.getId(), this.user.getLoginToken())
        .then(user => {
          Object.keys(user).forEach(x => {
            if (x === 'accountType'){
              if(user[x]==="Venue"){
                this.showCreate=true;
              }}})})


    this.makers = [];
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'transactions' parameter display transactionInfo
      const id = this.route.snapshot.paramMap.get('id');

      if (!!qMap['params'].transactions)
        this.fetchTransactions();
      else {
        this.transactions = false
        // when query has 'id' parameter display listings from user with id
        let uId = qMap['params'].id;
        if (uId)
            this.db.getUserListings(uId).then(l => {
              this.listings = l['listings'].sort(this.transactions ? (a, b) => 1 : this.sortCols[0].sortFunc)
              this.hasCancelled = this.listings.some(x => x.status === "cancelled")
          })
        //else display all listings
        else{
          this.db.getAllListings().then(l => {
            this.listings = l['listings'].sort((a, b) => (a.date ? a.date : "").localeCompare(b.date ? b.date : ""))
            this.hasCancelled = false;
            for (var listing of this.listings){ 
              this.broer = listing;
              this.db.getUserData(listing["userID"],this.user.getLoginToken())
              .then(u => {
                this.isLoading=false;
                // baby = (Object.assign(listing,u));
                // this.makers.push(baby);
                // console.log(baby);
              })
            }    
          })
      }}
    })
  }

  displayAfterStartTime(){
    var startTime = (<HTMLInputElement>document.getElementById("startTime")).value;
  }

  dsiplayBeforeEndTime(){
    var endTime = (<HTMLInputElement>document.getElementById("endTime")).value;
  }

  // get transactions and sort recent to last
  fetchTransactions(){
    this.db.getUserTransactions(this.user.getLoginToken())
        .then(l => {
          this.listings = l['transactions'].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map(x => {return {...x, ...x.listing}})
          this.hasCancelled = this.listings.some(x => x.status === "cancelled")
          this.transactions = true
        })
  }

  // cancel transaction
  cancelTransaction(transactionID: number){
    this.db.cancelTransaction(transactionID, this.user.getLoginToken())
      .then(_ => this.fetchTransactions()) // update transactionInfo
  }

  onItemSelect(item: any) {
    console.log(this.selectedItems);
  }

  onItemDeSelect(item: any) {
    console.log(this.selectedItems);
  }
  debug(u){
    console.log(u);
  }

  get displayedListings() {
    return this.filteredListings().slice(this.startIndex, this.startIndex + this.displayCount);
  }

  // Function to handle the "Next" button
  showNextListings() {
    if (this.startIndex + this.displayCount < this.filteredListings().length) {
      this.startIndex += this.displayCount;
    }
  }

  // Function to handle the "Previous" button
  showPreviousListings() {
    if (this.startIndex - this.displayCount >= 0) {
      this.startIndex -= this.displayCount;
    }
  }

  // Function to update the number of elements to display
  updateDisplayCount(count: number) {
    this.displayCount = count;
  }
}
