import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { User, UserService } from '../services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: UntypedFormGroup;
  error: string= "";

  fileName: string;
  fileNameBanner: string;
  imgSrc: string;
  imgSrcBanner: string;
  imgError: string;
  imgErrorBanner: string;
  accountType: string;

  constructor(private db: DbConnectionService,
    public user: UserService,
    private route: Router,
    private image: ImageService) {
      // initialize form fields
      this.form = new UntypedFormGroup({
        firstName: new UntypedFormControl(),
        lastName: new UntypedFormControl(),
        email: new UntypedFormControl(),
        displayName: new UntypedFormControl(),
        address: new UntypedFormControl(),
        phoneNumber: new UntypedFormControl(),
        password: new UntypedFormControl(),
        repeatPassword: new UntypedFormControl(),
        description: new UntypedFormControl()
      });
   }

  ngOnInit(): void {
    if(this.user.isLoggedIn()){
      this.route.navigateByUrl('/listings');
    }
  }
  
  accountTypeSelector(){
    if((<HTMLInputElement>document.getElementById("radiocheck")).checked){
      this.accountType="Venue"
    }
    else{
      this.accountType="Artist"
    }
  }
  
  signUp(){
    // collect form values
    let v = this.form.getRawValue();
    delete v.repeatPassword;
    v['accountType'] = this.accountType;
    v['profilePicture'] = this.imgSrc;
    if(this.accountType ==='Venue'){
      v['firstName']=null;
      v['lastName']=null;
    } else{
      v['address']=null;
    }
    v['profileBanner'] = this.imgSrcBanner;
    console.log(v);
    // //send data to the database
    this.db.signUp(v)  
      .then(_ => {
        // go to login page
        this.route.navigateByUrl('/login')
      })
      .catch(r => this.error = r.error.message);
  }

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

  fileSelectedBanner(ev){
    // no files selected
    if (ev.target.files.length === 0)
      return;
    // reset variables
    this.imgErrorBanner = undefined;
    this.imgSrcBanner = undefined;
    let p: File = <File>ev.target.files[0];
    this.fileNameBanner = p.name;
    // convert image to standard format
    this.image.convertFileToJpegBase64(p, (c) => {
      this.imgSrcBanner = c;
    }, (err) => {
      this.imgErrorBanner = err;
    }, 300, 300)
  }
}
