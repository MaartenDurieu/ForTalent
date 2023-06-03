import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  finalprice;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.finalprice=data.price;
   }

  ngOnInit(): void {
  }

}
