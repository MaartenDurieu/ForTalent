import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CategoriesComponent } from './categories/categories.component';
import { HistoryComponent } from './history/history.component';
import { DetailComponent } from './listings/detail/detail.component';
import { FormComponent } from './listings/form/form.component';
import { ListingsComponent } from './listings/listings.component';
import { LoginComponent } from './login/login.component';
import { MyListingsComponent } from './my-listings/my-listings.component';
import { ProfileDisplayComponent } from './profile-display/profile-display.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { WriteComponent } from './reviews/write/write.component';
import { SignupComponent } from './signup/signup.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessagesComponent } from './conversation/messages/messages.component';
import { LandingpageComponent } from './landingpage/landingpage.component';

const routes: Routes = [
  { path: '', redirectTo: '/landingpage', pathMatch: 'full' },
  { path: 'landingpage', component: LandingpageComponent},
  { path: 'reviews', component: ReviewsComponent},
  { path: 'profileDisplay/:id', component: ProfileDisplayComponent},
  { path: 'reviews/write/:id', component: WriteComponent},
  { path: 'transactions/userArtist', component: TransactionsComponent},
  { path: 'transactions/userVenue', component: TransactionsComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'profile/changePassword', component: ChangePasswordComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'listings/details/:id', component: DetailComponent },
  { path: 'listings/details/:id/:type', component: DetailComponent },
  { path: 'listings/form', component: FormComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'mylistings', component: MyListingsComponent},
  { path: 'calendar', component:CalendarComponent},
  { path: 'conversation', component:ConversationComponent},
  { path: 'messages', component:MessagesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
