import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgFor],
})
export class SelectMultipleComponent implements OnInit {

  @Input() options: string[] = [];
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();
  onSelectionChange(selectedOption: string) {
    this.optionSelected.emit(selectedOption);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
