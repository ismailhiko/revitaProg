// event.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface EventData {
  name: string;
  description: string;
  date: Date;
  address: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsCollection;

  constructor(private firestore: Firestore) {
    this.eventsCollection = collection(this.firestore, 'events');
  }

  // Ajouter un événement dans Firestore
  addEvent(event: EventData): Promise<void> {
    return addDoc(this.eventsCollection, event)
      .then(() => console.log('Événement ajouté avec succès'))
      .catch((error) => console.error('Erreur lors de l\'ajout de l\'événement', error));
  }

  // Récupérer les événements depuis Firestore
  getEvents(): Observable<EventData[]> {
    return collectionData(this.eventsCollection, { idField: 'id' }) as Observable<EventData[]>;
  }
}
