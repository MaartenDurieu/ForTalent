import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DbConnectionService } from '../services/db-connection.service';
import { User, UserService } from '../services/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: UntypedFormGroup;
  error: string = ""
  isLoading: boolean;

  constructor(private db: DbConnectionService,
    private user: UserService,
    private location: Location, private router: Router) {
    // initialize form fields
    this.form = new UntypedFormGroup({
      login: new UntypedFormControl(),
      password: new UntypedFormControl(),
      keepSignedIn: new UntypedFormControl()
    });
  }

  ngOnInit(): void {
  }

  // onSubmit function
  logIn(){
    this.isLoading=true;
    // collect form values
    let d = this.form.getRawValue();
    // sign in
    this.db.signIn(d.login, d.password)
      .then((r: User) => {
        this.user.storeCookie = d.keepSignedIn
        // set user locally
        this.user.setUser(r);
        // go back to previous page
        this.router.navigateByUrl("/listings");
        // this.location.back();
        this.isLoading=false;
      })
      .catch(r => {this.error = r.error.message; this.isLoading=false;});
  }
}
