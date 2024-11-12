import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.css']
})
export class EventPopupComponent implements OnInit {
  formattedDate: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public event: any) { }

  ngOnInit(): void {
    if (this.event && this.event.date) {
      this.formattedDate = new Date(this.event.date).toLocaleDateString();
    }
  }

  onParticipate() {
    alert('Vous participez à l\'événement ' + this.event.name);
  }
}
