import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionAlertComponent } from './estacion-alert.component';

describe('EstacionAlertComponent', () => {
  let component: EstacionAlertComponent;
  let fixture: ComponentFixture<EstacionAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
