import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup7Component } from './popup7.component';

describe('Popup7Component', () => {
  let component: Popup7Component;
  let fixture: ComponentFixture<Popup7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Popup7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Popup7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
