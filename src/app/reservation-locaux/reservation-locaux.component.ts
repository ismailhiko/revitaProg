import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-reservation-locaux',
  templateUrl: './reservation-locaux.component.html',
  styleUrls: ['./reservation-locaux.component.css'],
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule
  ]
})
export class ReservationLocauxComponent {
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservationLocauxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { localId: string }
  ) {
    // Initialisation du formulaire de réservation
    this.reservationForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  // Méthode pour soumettre la réservation
  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = {
        localId: this.data.localId,
        ...this.reservationForm.value
      };
      this.dialogRef.close(reservationData); // Ferme le dialogue et envoie les données
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
