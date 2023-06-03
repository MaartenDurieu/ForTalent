import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup6Component } from './popup6.component';

describe('Popup6Component', () => {
  let component: Popup6Component;
  let fixture: ComponentFixture<Popup6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Popup6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Popup6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
