import { OnInit } from '@angular/core';
import {Component, EventEmitter, Output, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-select-one',
  templateUrl: './select-one.component.html',
  styleUrls: ['./select-one.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatInputModule, FormsModule],
})
export class SelectOneComponent implements OnInit {
  selectedOption;
  constructor() {
   }
  @Input() options: string[] = [];
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  onSelectionChange(selectedOption: string) {
    this.optionSelected.emit(selectedOption);
  }
  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

}
