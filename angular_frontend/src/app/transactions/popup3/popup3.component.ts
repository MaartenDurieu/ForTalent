import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup3',
  templateUrl: './popup3.component.html',
  styleUrls: ['../popup/popup.component.scss'],
  encapsulation: ViewEncapsulation.None // add this line
})
export class Popup3Component implements OnInit {
  rejectedprice;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.rejectedprice=data.price;
   }

  ngOnInit(): void {
  }

}
