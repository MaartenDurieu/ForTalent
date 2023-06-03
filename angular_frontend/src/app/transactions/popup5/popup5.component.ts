import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup5',
  templateUrl: './popup5.component.html',
  styleUrls: ['../popup/popup.component.scss']
})
export class Popup5Component implements OnInit {

  message
  constructor(@Inject(MAT_DIALOG_DATA) public data, private matDialogRef: MatDialogRef<Popup5Component>) {
    this.message=data.message;
   }

  ngOnInit(): void {
  }

}
