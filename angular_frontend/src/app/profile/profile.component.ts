import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router,NavigationEnd,ActivatedRoute } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  error: string;
  form: UntypedFormGroup;

  fileName: string;
  fileNameBanner: string;
  imgSrc: string;
  imgSrcBanner: string;
  imgErrorBanner: string;
  imgError: string;

  constructor(public user: UserService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private db: DbConnectionService,
    private image: ImageService) {
      // redirect to login page when not logged in
      if (!user.isLoggedIn())
        this.route.navigateByUrl("/login")
      // initialize form fields
      this.form = new UntypedFormGroup({
        firstName: new UntypedFormControl(),
        lastName: new UntypedFormControl(),
        email: new UntypedFormControl(),
        displayName: new UntypedFormControl(),
        address: new UntypedFormControl(),
        phoneNumber: new UntypedFormControl(),
        description: new UntypedFormControl()
      });
    }

  ngOnInit(): void {
    // get user data
    this.db.getUserData(this.user.getId(), this.user.getLoginToken())
      .then(user => {
        Object.keys(user).forEach(x => {
          if (x === 'profilePicture')
            this.imgSrc = user[x]
          else if (x === 'profileBanner')
            this.imgSrcBanner = user[x]
          else if (x === 'accountType'){
            if(user[x]==="Venue"){
              document.getElementById("FN").style.display = "none";
              document.getElementById("LN").style.display = "none";
            }
          }
          else
            // fill out form with userdata
            this.form.get(x).setValue(user[x])
        })
      })
      .catch(r => this.error = r.error.message);
  }

  refresh(){
    this.route.navigate([this.route.url]);
  }

  // onSubmit function
  updateProfile(){
    // collect new userdata
    let v = this.form.getRawValue()
    // add profile picture
    v['profilePicture'] = this.imgSrc;
    v['profileBanner'] = this.imgSrcBanner;
    // send new userdata to db
    this.db.postUserData(this.user.getId(), this.user.getLoginToken(), v)
      .then(_ =>{
        // update userdata locally
        this.user.setUser({
          id: this.user.getId(),
          displayName: v.displayName,
          accessToken: this.user.getLoginToken()
        });
        this.route.navigate(['/profileDisplay'],{ queryParams: {Id: this.user.getId()}});
      })
    .catch(err => this.error = "No changes detected");
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

