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
[x: string]: any;
  @Output() ajouterEvenementClicked = new EventEmitter<void>();

  ajouterEvenement(): void {
    this.ajouterEvenementClicked.emit();
  }
}
