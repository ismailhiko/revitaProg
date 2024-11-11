import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterEvenementComponent } from './ajouter-evenement.component';

describe('AjouterEvenementComponent', () => {
  let component: AjouterEvenementComponent;
  let fixture: ComponentFixture<AjouterEvenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterEvenementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
