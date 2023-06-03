import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup4Component } from './popup4.component';

describe('Popup4Component', () => {
  let component: Popup4Component;
  let fixture: ComponentFixture<Popup4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Popup4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Popup4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
