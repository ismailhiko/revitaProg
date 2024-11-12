import { Component, EventEmitter, Output } from '@angular/core';
import { AjouterEvenementComponent } from "../ajouter-evenement/ajouter-evenement.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrls: ['./menu.component.css'],
  imports: [AjouterEvenementComponent],
})
export class MenuComponent {

  modeAffichage: 'evenements' | 'locaux' = 'evenements'; // Valeur par défaut : recherche d'événements

  [x: string]: any;

  @Output() ajouterEvenementClicked = new EventEmitter<void>();

  @Output() modeChange = new EventEmitter<string>();

  ajouterEvenement(): void {
    this.ajouterEvenementClicked.emit();
  }

  setModeAffichage(mode: string): void {
    this.modeChange.emit(mode);
  }
}
