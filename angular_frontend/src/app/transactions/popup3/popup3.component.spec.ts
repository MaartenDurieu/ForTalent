import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup3Component } from './popup3.component';

describe('Popup3Component', () => {
  let component: Popup3Component;
  let fixture: ComponentFixture<Popup3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Popup3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Popup3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
