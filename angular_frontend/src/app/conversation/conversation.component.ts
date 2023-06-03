import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, 
    private user:UserService, private route: Router, private db: DbConnectionService) { }

  conversations: Object[]=[];
  conversationIDS: number[] = [];

  ngOnInit(): void {
    // this.db.getUserConversations(this.user.getId()).then(conversations => {this.conversations=conversations["conversations"]
    // console.log(this.conversations);
    // })
    this.db.getLastMessagesConID(this.user.getId()).then(conversationIDS => {
      this.conversationIDS = conversationIDS["messages"].map(a => a["conversationID"]);
    }).then(_ => {
      this.conversationIDS.forEach(id => {this.db.getMostRecentMessage(id)
        .then(c => {this.conversations.push(c["messages"])})
      })
    }).then(__ => {console.log(this.conversations)})
    }
  
  
  }


