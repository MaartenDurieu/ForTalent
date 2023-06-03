import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public router: Router) {}

  messages: Object[]=[];
  conversationID: number;

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qMap => {console.log(qMap['params']);
      this.conversationID = qMap["params"]["conversationID"];
    console.log(this.conversationID)
      this.db.getMessages(this.conversationID).then(messages => {this.messages=messages["messages"];})
    })
  }

  printMessages(){
    console.log(this.messages);
  }

}
