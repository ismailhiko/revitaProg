import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule ici
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css'],
  standalone: true, // Indiquer que ce composant est autonome
  imports: [CommonModule], // Ajouter CommonModule aux imports
})
export class ShopDetailsComponent {
  [x: string]: any;
  constructor(
    public dialogRef: MatDialogRef<ShopDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      console.log("data :", data);
      console.log("Longitude :", data.long ?? 'Non définie');
    } else {
      console.error("Les données du commerce ne sont pas disponibles.");
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  partager(): void {
    if (navigator.share) {
      // Vérifier que l'API Web Share est disponible
      navigator.share({
        title: this.data.name,
        text: `Découvrez ${this.data.name} situé à ${this.data.address}.`,
        url: "https://www.google.com/maps/dir/?api=1&destination="+this.data.lat+','+this.data.long, // Vous pouvez mettre ici un lien spécifique, comme l'adresse Google Maps
      })
      .then(() => console.log('Partage réussi'))
      .catch((error) => console.error('Erreur lors du partage', error));
    } else {
      console.error("L'API Web Share n'est pas supportée sur ce navigateur.");
    }
  }
}
