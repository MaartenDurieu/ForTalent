import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  listing: object;
  error: string;
  form:FormGroup;
  transactions = [];
  reviews = [];
  avgScore: number = 0;
  selectedTab = ""; // ["info", "reviews", "transactions"]
  loading = 0; // #asynchronous tasks running

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public image: ImageService) {
      // initialize form field
      this.form = new FormGroup({
        numberOfAssets: new FormControl()
      });
    }

  ngOnInit(): void {
    // get url query params
    this.route.params.subscribe(params => {
      this.error = "";
      // when detail-type is given in url
      if (params.type && ["info", "reviews", "transactions"].includes(params.type))
        this.selectedTab = params.type;
      // get listingdata
      this.db.getListing(params.id)
        .then(l => {
          this.db.getCategories().then(c => {
            let categories = [];
            Object.entries(c).forEach(([k, v]) => {
              let v2 = v.filter(x => l["categories"].includes(x));
              if (v2.length > 0)
                categories.push([k, v2])
            })
            this.listing = l;
            this.listing['categories'] = categories;
            this.loadReviews();
            // if listing if made by logged in user show transactions
            if (this.listing['userID'] === this.user.getId())
              this.loadTransactions();
          })

        })
        .catch(err => this.error = err.error.message);
    })
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

  // get transactions
  loadTransactions(){
    this.loading += 1;
    this.db.getListingTransactions(this.listing['listingID'], this.user.getLoginToken())
      .then(b => {
        this.transactions = b['transactions']
        this.transactions.forEach(t => {
          this.db.getUserReviews(t['customerID']).then(r => {
            t['userReviews'] = r['reviews']
            t['userScore'] = r['score']
          });
        })
        this.onFinishLoading();
      }).catch(err => {
        this.error = err.error.message
      })
  }

  // delete listing
  cancelListing(id: number){
    this.db.cancelListing(id, this.user.getLoginToken()).then(_ => {
      this.listing['status'] = 'cancelled'
      // update transaction data
      this.loadTransactions();
    })
  }

  // create transaction
  createTransaction(){
    // get form value
    let v = this.form.getRawValue()
    // add listingID to form values
    v['listingID'] = this.listing['listingID'];
    this.db.createTransaction(this.user.getLoginToken(), v).then(_ => {
      // go to transactions
      this.router.navigate(['/listings'], {queryParams: { transactions: true }})
    })
  }

  // cancel transaction
  cancelTransaction(transactionId: number){
    this.db.cancelTransaction(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }

  // confirm transaction payment
  confirmPayment(transactionId: number){
    this.db.confirmPayment(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }
}
