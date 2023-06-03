import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup4',
  templateUrl: './popup4.component.html',
  styleUrls: ['../popup/popup.component.scss']
})
export class Popup4Component implements OnInit {
  cancelledprice;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.cancelledprice=data.price;
   }

  ngOnInit(): void {
  }

}
