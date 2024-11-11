import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLocauxComponent } from './location-locaux.component';

describe('LocationLocauxComponent', () => {
  let component: LocationLocauxComponent;
  let fixture: ComponentFixture<LocationLocauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationLocauxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationLocauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
