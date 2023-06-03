import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { ListingsComponent } from './listings/listings.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from '@angular/material/core';
import { DetailComponent } from './listings/detail/detail.component';
import { FormComponent } from './listings/form/form.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { CategoriesComponent } from './categories/categories.component';
import {MatIconModule} from '@angular/material/icon';
import { TransactionsComponent } from './transactions/transactions.component';
import { HistoryComponent } from './history/history.component';
import {MatDialogModule} from '@angular/material/dialog';
import { PopupComponent } from './transactions/popup/popup.component';
import { Popup2Component } from './transactions/popup2/popup2.component';
import { Popup3Component } from './transactions/popup3/popup3.component';
import { Popup4Component } from './transactions/popup4/popup4.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MatSelectModule } from '@angular/material/select';
import {RouterModule} from '@angular/router';
import { WriteComponent } from './reviews/write/write.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MyListingsComponent } from './my-listings/my-listings.component';
import { Popup5Component } from './transactions/popup5/popup5.component';
import { Popup6Component } from './transactions/popup6/popup6.component';
import { Popup7Component } from './transactions/popup7/popup7.component';
import { CalendarComponent} from './calendar/calendar.component';
import {
  CalendarModule,
  DateAdapter,
  CalendarNativeDateFormatter,
  CalendarDateFormatter,
  DateFormatterParams,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileDisplayComponent } from './profile-display/profile-display.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessagesComponent } from './conversation/messages/messages.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectOneComponent } from './select-one/select-one.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        ProfileComponent,
        ListingsComponent,
        DetailComponent,
        ChangePasswordComponent,
        CategoriesComponent,
        TransactionsComponent,
        HistoryComponent,
        PopupComponent,
        Popup2Component,
        Popup3Component,
        Popup4Component,
        ReviewsComponent,
        WriteComponent,
        LoadingSpinnerComponent,
        MyListingsComponent,
        Popup5Component,
        Popup6Component,
        Popup7Component,
        CalendarComponent,
        ProfileDisplayComponent,
        MessagesComponent,
        ConversationComponent,
        LandingpageComponent,
    ],
    providers: [CookieService,
        MatDatepickerModule,
        MatNativeDateModule],
    bootstrap: [AppComponent],
    entryComponents: [FormComponent, SelectOneComponent, SelectMultipleComponent],
    imports: [
        CommonModule,
        NgMultiSelectDropDownModule.forRoot(),
        BrowserModule,
        NgbModalModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatIconModule,
        MatDialogModule,
        RouterModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }, {
            dateFormatter: {
                provide: CalendarDateFormatter,
                useClass: AppModule,
            },
        }),
        SelectOneComponent,
        SelectMultipleComponent
    ]
})
export class AppModule extends CalendarNativeDateFormatter { 
  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }
}

