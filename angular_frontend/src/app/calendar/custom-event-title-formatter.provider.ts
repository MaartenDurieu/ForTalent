import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe, formatDate } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale:string) {
    super();
  }

  // you can override any of the methods defined in the parent class  
  month(event: CalendarEvent): string {
    if(event.status=="Booked"){
      return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)}
      Booked by: ${event.artistDisplayName} (Negotiated Pay: €${event.suggestedPrice}/hr)`;
    } else if(event.status == "active"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} ${
        event.title} (Suggested Pay: €${event.suggestedPrice}/hr)` ;
    } else if(event.status == "AwaitingPayment"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} Transaction in Progress`;
    } else if(event.status == "Filled" || event.status=="Reviewable" || event.status=="Completed" || event.status=="ArtistReviewed" || event.status=="VenueReviewed"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} 
        Performance by: ${event.artistDisplayName} (Negotiated Pay: €${event.suggestedPrice}/hr)`;
    }
  }

  week(event: CalendarEvent): string {
    if(event.title=="Booked"){
      return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} 
      Booked by: ${event.artistDisplayName} (Negotiated Pay: €${event.suggestedPrice}/hr)`;
    } else if(event.status == "active"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} <br> ${
        event.title} <br> (Suggested Pay: €${event.suggestedPrice}/hr)` ;
    } else if(event.status == "AwaitingPayment"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)} <br> Transaction in Progress`;
    } else if(event.status == "Filled"|| event.status=="Reviewable" || event.status=="Completed"){
        return `${formatDate(event.start, 'HH:mm', this.locale)}-${formatDate(event.end, 'HH:mm', this.locale)}
      Performance by: ${event.artistDisplayName} <br> (Negotiated Pay: €${event.suggestedPrice}/hr)`;
    }
  }
}