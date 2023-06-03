import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup2',
  templateUrl: './popup2.component.html',
  styleUrls: ['../popup/popup.component.scss']
})
export class Popup2Component implements OnInit {
  finalprice;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.finalprice=data.price;
   }

  ngOnInit(): void {
  }

}
