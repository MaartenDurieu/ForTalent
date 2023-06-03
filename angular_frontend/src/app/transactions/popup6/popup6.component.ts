import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup6',
  templateUrl: './popup6.component.html',
  styleUrls: ['../popup/popup.component.scss']
})
export class Popup6Component implements OnInit {
  editprice;
  genre;
  artistType;
  ArtistTypes=[];
  Genres=[];
  message;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private matDialogRef: MatDialogRef<Popup6Component>) {
    this.editprice=data.suggestedPay;
    this.genre=data.genre;
    this.artistType=data.artistType;
    this.ArtistTypes=data.typesArray;
    this.Genres=data.genreArray;
    this.message=data.message;
   }

  ngOnInit(): void {
  }

  onSubmit(){
    const info = 5;
   
  }
  accept(){
    this.data.suggestedPay=+(<HTMLInputElement>document.getElementById("price")).value;
    this.matDialogRef.close(this.data);
  }

  closeClick(){
    this.data=null
    this.matDialogRef.close(null);
  }
}
