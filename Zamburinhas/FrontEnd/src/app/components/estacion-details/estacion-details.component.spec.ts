import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstacionDetailsComponent } from './estacion-details.component';

describe('EstacionDetailsComponent', () => {
  let component: EstacionDetailsComponent;
  let fixture: ComponentFixture<EstacionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstacionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstacionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
