import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { EventData, EventService } from '../services/event.service';

@Component({
  selector: 'app-ajouter-evenement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './ajouter-evenement.component.html',
  styleUrls: ['./ajouter-evenement.component.css'],
})
export class AjouterEvenementComponent {
  eventForm: FormGroup;

  @Output() evenementAjoute = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private http : HttpClient, private eventService: EventService) {
    // Initialisation du formulaire
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  // Méthode pour soumettre le formulaire
  ajouterEvenement(): void {
    if (this.eventForm.valid) {
      const address = this.eventForm.value.address;

      this.geocodeAddress(address).subscribe((coordinates) => {
        if (coordinates) {
          // Ajouter l'événement après avoir obtenu les coordonnées
          const event: EventData = {
            ...this.eventForm.value,
            latitude: coordinates.lat,
            longitude: coordinates.lon,
          };

          this.evenementAjoute.emit(event);

          console.log('Événement ajouté', event);

          // // Enregistrer l'événement dans Firebase
          // this.eventService.addEvent(event)
          //   .then(() => {
          //     console.log('Événement enregistré dans Firebase avec succès');
          //   })
          //   .catch((error) => {
          //     console.error('Erreur lors de l\'enregistrement de l\'événement dans Firebase', error);
          //   });

          this.eventForm.reset();
        } else {
          console.error('Impossible de géocoder l\'adresse.');
        }
      });
    }
  }

  // Méthode pour obtenir les coordonnées à partir de l'adresse
  geocodeAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return this.http.get<any[]>(url).pipe(
      // On suppose que le premier résultat est le meilleur match
      map((results) => {
        if (results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lon: parseFloat(results[0].lon),
          };
        } else {
          return null;
        }
      })
    );
  }

}
