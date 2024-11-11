import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule ici
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css'],
  standalone: true,  // Indiquer que ce composant est autonome
  imports: [CommonModule] // Ajouter CommonModule aux imports
})
export class ShopDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ShopDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
