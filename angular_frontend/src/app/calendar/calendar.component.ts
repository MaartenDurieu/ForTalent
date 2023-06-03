import {Component,ChangeDetectionStrategy,ViewChild,TemplateRef,OnInit, ViewEncapsulation, Input} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarEventTitleFormatter,CalendarView,} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

const colors: Record<string, EventColor> = {
  gray: {
    primary: '#C9C9C9',
    secondary: '#C9C9C9',
  },
  green: {
    primary: '#b6d7a8',
    secondary: '#b6d7a8',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: red;
        padding: 15px;
      }
    `,
  ],
  templateUrl: 'calendar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  isLoading: boolean;

  venueAccount: boolean;

  notifications: Object[]= [];
  notificationsAmount: number;

  view: CalendarView = CalendarView.Month;

  foo: string;
  sameAccount: boolean=false;
  userDisplayName: string;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  userID: number;

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  @Input() requestID: number;
  
  constructor(private modal: NgbModal, private user: UserService, private route: ActivatedRoute,private db: DbConnectionService,
    @Inject(LOCALE_ID) private locale:string) {}

  //Day clicked on month calendar
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // for layout: https://mattlewis92.github.io/angular-calendar/#/dark-theme

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action};
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit(): void {
    if(this.requestID===undefined || this.requestID===null){
      this.userID=this.user.getId()
      this.db.getUserNotificationsMerged(this.user.getLoginToken()).then(notifications => {
        this.notificationsAmount = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="paymentReceived")).length;
      this.notifications = notifications["notifications"]
        .filter(f => (f["viewed"]==0)&&(f["type"]=="paymentReceived"));
      notifications["notifications"].filter(f => (f["viewed"]==0)
      && f["type"]=="paymentReceived")
      .forEach(n=> {this.db.markNotificationAsViewed(n["notificationID"],this.user.getLoginToken());})
      })
      console.log(this.notifications);
    }
    else{
      this.userID=this.requestID;
    }
    this.isLoading=true;
    this.db.getUserData(this.userID,this.user.getLoginToken()).then(user => {this.userDisplayName = user["displayName"];
    if(user["accountType"]=="Venue"){
      this.venueAccount=true;
    }else if(user["accountType"]=="Artist"){
      this.venueAccount=false;
    }}).then(_ => {
    if(this.venueAccount==true){
      console.log("venue");
        this.db.getArtistMergedListings(this.userID).then(listings => {
          listings["listings"].forEach(listing=> {
            let titleItem;
            let colorItem;
            if(listing.status=='active'){
              titleItem = 'Open Listing';
              colorItem = colors.gray;
            } else if(listing.status=='AwaitingPayment'){
              titleItem = 'In Progress';
              colorItem = colors.green;
            } else if(listing.status=='Filled' || listing.status=="Reviewable" || listing.status=="Completed" ||
            listing.status=="ArtistReviewed" || listing.status=="VenueReviewed"){
              titleItem = 'Filled listing';
              colorItem = colors.yellow;
              this.foo = listing.user.displayName;
            } else{
              return;
            }
           
            const [year,month,day] = listing.date.split('-');
            const [hoursStart,minutesStart] = listing.startTime.split(':');
            const [hoursEnd, minutesEnd] = listing.endTime.split(':');
    
            let starter = new Date(year,month-1,day,hoursStart,minutesStart);
            let ender = new Date(year,month-1,day,hoursEnd,minutesEnd);
    
            if(starter > ender){
              ender = new Date(ender.setDate(ender.getDate()+1));
            }
    
            let newCalendarItem: CalendarEvent = {
              title: titleItem,
              hover: listing.title,
              start: starter,
              end: ender,
              color: colorItem,
              userID: listing.userID,
              suggestedPrice: listing.suggestedPrice,
              status: listing.status,
              cssClass: 'my-custom-class',
              artistID: listing.artistID,
              artistDisplayName: this.foo,
              location:listing.location,
              listingID: listing.listingID,
              genre:listing.genre,
              artistType:listing.artistType,
              userDisplayName: this.userDisplayName
            };
            this.events.push(newCalendarItem);
            console.log(this.events);
          });
          this.isLoading=false;this.refresh.next()
        });console.log(this.events);}
  else if (this.venueAccount==false){
    console.log("artist");
    this.db.getVenueMergedListings(this.userID).then(listings => {
      listings["listings"].forEach(listing=> {    
        const [year,month,day] = listing.date.split('-');
        const [hoursStart,minutesStart] = listing.startTime.split(':');
        const [hoursEnd, minutesEnd] = listing.endTime.split(':');

        let starter = new Date(year,month-1,day,hoursStart,minutesStart);
        let ender = new Date(year,month-1,day,hoursEnd,minutesEnd);

        if(starter > ender){
          ender = new Date(ender.setDate(ender.getDate()+1));
        }
  
        let newCalendarItem: CalendarEvent = {
          title: 'Booked',
          hover: listing.title,
          start: starter,
          end: ender,
          color: colors.yellow,
          userID: listing.userID,
          suggestedPrice: listing.suggestedPrice,
          status: 'Booked',
          cssClass: 'my-custom-class',
          artistID: listing.artistID,
          artistDisplayName: listing.user.displayName,
          location:listing.location,
          listingID: listing.listingID,
          genre:listing.genre,
          artistType:listing.artistType,
          userDisplayName: this.userDisplayName
        };
        this.events.push(newCalendarItem);
      });
      this.isLoading=false;this.refresh.next();
    });
  }});
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getProfileLink(account: string){
    if(account==='artist'){
      return ['/profileDisplay',this.modalData?.event.artistID]
    }
    else{
      return ['/profileDisplay',this.modalData?.event.userID]
    }
  }
}