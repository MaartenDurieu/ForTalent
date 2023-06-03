import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup5Component } from './popup5.component';

describe('Popup5Component', () => {
  let component: Popup5Component;
  let fixture: ComponentFixture<Popup5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Popup5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Popup5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
