import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgFor, NgIf],
})
export class FormComponent implements OnInit {

  artistType = new FormControl('');
  genre = new FormControl('');
  artistTypes: string[] = ["Singer","DJ","Band"];
  genres: string[] = ["Alternative","Blues","Classical","Country","Electronic","Experimental","Instrumental","Jazz","Latin","Rap", "R&B","Rock","Urban"];

  genrestring: string;
  artisttypestring: string;

  fileName: string;
  fileNameBanner: string;
  imgSrcBanner: string ="";
  imgErrorBanner: string;
  imgSrcDefault: string;
  imgSrcBannerDefault: string;
  locationDefault: string;
  imgSrc: string="";
  imgError: string;
  

  customAddress: boolean=false;
  publicCheck: boolean;
  status: string;
  suggestedPrice: BigInteger;

  form: UntypedFormGroup;
  error: string
  listingID: number = -1;

  userlistings=[];

  minDate: string;
  editOverlap: boolean=false;

  listingType:string="Public";


  constructor(private user: UserService,
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private router: Router,
    private image: ImageService) {
    // redirect to login page when not logged in
    if (!this.user.isLoggedIn())
        this.router.navigateByUrl("/login")
    // initialize form fields
    this.form = new UntypedFormGroup({
      description: new UntypedFormControl(),
      date: new UntypedFormControl(),
      startTime: new UntypedFormControl(),
      endTime: new UntypedFormControl(),
      suggestedPrice: new UntypedFormControl(),
      location: new UntypedFormControl(),
      title: new UntypedFormControl(),
    })
   }

  listingTypeSelector(){
    if((<HTMLInputElement>document.getElementById("radio-private")).checked){
      this.listingType="Public"
    }
    else{
      this.listingType="Private"
    }
  }

  addressSelector(){
    if((<HTMLInputElement>document.getElementById("radio-address")).checked){
      this.customAddress=true
    }
    else{
      this.customAddress=false
    }
  }

  ngOnInit(): void {
     // get url query params
     this.route.queryParamMap.subscribe(qMap => {
      // when query has 'edit' parameter, edit listing data
      let lId = qMap['params'].edit;
      if (lId){
        this.db.getListing(lId).then(l => {
          // update listingID
          this.editOverlap = true;
          this.listingID = l['listingID']
          // fill out form with listingdata
          this.form.patchValue({
            title: l['title'],
            description: l['description'],
            suggestedPrice: l['suggestedPrice'],
            date: l['date'],
            startTime: l['startTime'],
            endTime: l['endTime'],
          })
          if (l['listingBanner']){
            this.db.getUserData(l["userID"],this.user.getLoginToken()).then(x => {
              if(x["profileBanner"]===l['listingBanner']){
                (<HTMLInputElement>document.getElementById('accountBanner')).checked = true;}
              else{
                (<HTMLInputElement>document.getElementById('customBanner')).checked = true;
                (<HTMLInputElement>document.getElementById('customBannerDisplay')).style.display = "block";
                this.imgSrcBanner = l['listingBanner']
                this.imgErrorBanner = ""}
            })}
          if(l['genre']){
            var genres = l['genre'].split(" ");
            for(var genre of genres){
              (<HTMLInputElement>document.getElementById(genre)).checked = true;}}
          if(l['artistType']){
            var artists = l['artistType'].split(" ");
            for(var artist of artists){
              (<HTMLInputElement>document.getElementById(artist)).checked = true;
            }}
          if(l['public']){
            if(l['public']==1){
              (<HTMLInputElement>document.getElementById('public')).checked = true;}
            else{
              (<HTMLInputElement>document.getElementById('private')).checked = true;}}
          if(l['location']){
            this.db.getUserData(l["userID"],this.user.getLoginToken()).then(x => {
              if(x["address"]===l['location']){
                (<HTMLInputElement>document.getElementById('accountAddress')).checked = true;}
              else{
                (<HTMLInputElement>document.getElementById('customAddress')).checked = true;
                (<HTMLInputElement>document.getElementById('inputLocation')).style.display = "block";
                this.form.patchValue({
                  location: l['location']
                })}
            })}
    })}})
    this.db.getUserListings(this.user.getId()).then(x=> {this.userlistings = x['listings']})
    this.db.getUserData(this.user.getId(),this.user.getLoginToken()).then(user => {
      Object.keys(user).forEach(x => {
        if (x === 'profilePicture'){
          this.imgSrcDefault = user[x];}
        else if (x === 'profileBanner'){
          this.imgSrcBannerDefault = user[x];}
        else if(x === 'address'){
          this.locationDefault= user[x];}})})
    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("datePicker")[0].setAttribute('min', today);
  }

  isCheckedGenre(){
    var checkboxes = document.querySelectorAll('input[name="genre"]:checked');
    if(checkboxes.length>0){
      return true;
    }
    return false;}
  isCheckedArtistType(){
    var checkboxes = document.querySelectorAll('input[name="requiredTalent"]:checked');
    if(checkboxes.length>0){
      return true;
    }
    return false;}

    showAdd(){
    let checkbox = <HTMLInputElement>document.getElementById("Add");
    if(checkbox.checked){
      document.getElementById("inputLocation").style.display = "none";
    }else{
      document.getElementById("inputLocation").style.display = "block";
    }
  }
  showAd(){
    let checkbox = <HTMLInputElement>document.getElementById("Ad");
    if(checkbox.checked){
      document.getElementById("inputPicture").style.display = "none";
      this.imgSrc=null;
    }else{
      document.getElementById("inputPicture").style.display = "block";
    }
  }

  useAccountAddress(){
    document.getElementById("inputLocation").style.display = "none";}
  useCustomAddress(){
    document.getElementById("inputLocation").style.display = "block";}
  useAccountProfilePicture(){
    document.getElementById("customProfilePictureDisplay").style.display = "none";}
  useCustomProfilePicture(){
    document.getElementById("customProfilePictureDisplay").style.display = "block";}
  useAccountBanner(){
    document.getElementById("customBannerDisplay").style.display = "none";}
  useCustomBanner(){
    document.getElementById("customBannerDisplay").style.display = "block";}

 
  // select file
  fileSelected(ev){
    // no files selected
    if (ev.target.files.length === 0)
      return;
    // reset variables
    this.imgError = undefined;
    this.imgSrc = undefined;
    let f: File = <File>ev.target.files[0];
    this.fileName = f.name;
    // convert image to standard format
    this.image.convertFileToJpegBase64(f, (c) => {
      this.imgSrc = c;
    }, (err) => {
      this.imgError = err;
    }, 300, 300)
  }

  handlegenreChange(): void {
    if (!this.genre.value) {
      this.genre.markAsTouched();
    }
  }

  handtypeChange(): void {
    if (!this.artistType.value) {
      this.artistType.markAsTouched();
    }
  }
  // onSubmit function
  createListing(){
    this.error="";
    if(!([this.genre.value].join(",").length>0 && [this.artistType].join(",").length>0)){
      this.error="Please select more than one genre and/or type"
      return;
    }
    this.status="active";
    // get values
    let v = this.form.getRawValue();
    if((<HTMLInputElement>document.getElementById("radio-private")).checked){
      v['public'] = true;
    }
    else {
      v["public"] = false;
    }
    
    v["genre"]=[this.genre.value].join(",");
    v["artistType"]= [this.artistType.value].join(",");
    v["userID"]=this.user.getId();

    if(!((<HTMLInputElement>document.getElementById("radio-address")).checked)){
      v['location'] = this.locationDefault;
    }
      else{
        if(v['location']==null){
          v['location'] = this.locationDefault;
        }}
        v['listingPicture'] = this.imgSrc;
 
    if(this.editOverlap==false){
    for(var list of this.userlistings){
      if(v['date']===list['date']){
        if(v['location'].toLowerCase()===list['location'].toLowerCase()){
          if((list["startTime"]<=v["startTime"] && list["startTime"]<=v["endTime"]) 
            || (list["endTime"]>=v["startTime"] && list["endTime"]>=v["endTime"])
            || (list["startTime"]>=v["startTime"] && list["endTime"]<=v["endTime"])){
            //Do something
            this.error = "Error: This listing overlaps with the timeslot, location and date from another listing on your profile";
            return;
          }}}}}
    //create listing
    if (this.listingID < 0){
      //Listing first created
      console.log(v);
      this.db.createListing(this.user.getLoginToken(), v).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${r['listingID']}`)
      }).catch(err => this.error = err.error.message)}

      //Listing has an id already: update it
    else 
      this.db.postListing(this.listingID, this.user.getLoginToken(), v).then(r => {
        // go to details page
        this.router.navigateByUrl(`/listings/details/${this.listingID}`)
      }).catch(err => this.error = err.error.message)
   }
}
