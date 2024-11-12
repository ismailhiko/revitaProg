import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';




@Component({
  standalone: true,
  selector: 'app-location-locaux',
  templateUrl: './location-locaux.component.html',
  styleUrls: ['./location-locaux.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LocationLocauxComponent implements OnInit {
  locaux: any[] = []; // Liste des locaux après recherche
  map!: L.Map;
  searchForm: FormGroup;
  markers: L.Marker[] = []; // Liste des marqueurs pour gérer l'affichage dynamique
  showLocauxList = false;
  defaultLocaux: any[] = [{
    name: 'Boulangerie des Lucioles',
    address: '15 Route des Lucioles, Sophia Antipolis',
    type: 'Boulangerie',
    imageUrl: '../assets/local.jpg', // Remplacez par une URL d'image réelle si possible
    lat: 43.6165,
    lon: 7.0655
  },
  {
    name: 'Librairie de Sophia',
    address: '23 Route des Dolines, Sophia Antipolis',
    type: 'Librairie',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6158,
    lon: 7.0660
  },
  {
    name: 'Café des Lucioles',
    address: '2 Allée des Erables, Sophia Antipolis',
    type: 'Café',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6170,
    lon: 7.0642
  },
  {
    name: 'Épicerie Bio de Sophia',
    address: '8 Avenue de Roumanille, Sophia Antipolis',
    type: 'Épicerie',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6163,
    lon: 7.0638
  },
  {
    name: 'Pharmacie des Collines',
    address: '5 Chemin des Crêtes, Sophia Antipolis',
    type: 'Pharmacie',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6157,
    lon: 7.0651
  },
  {
    name: 'Bijouterie des Dolines',
    address: '10 Route des Dolines, Sophia Antipolis',
    type: 'Bijouterie',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6169,
    lon: 7.0627
  },
  {
    name: 'Restaurant Le Provençal',
    address: '6 Avenue des Iris, Sophia Antipolis',
    type: 'Restaurant',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6172,
    lon: 7.0645
  },
  {
    name: 'Fleuriste des Lucioles',
    address: '18 Rue de Sophia, Sophia Antipolis',
    type: 'Fleuriste',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6161,
    lon: 7.0662
  },
  {
    name: 'Magasin Bio Naturel',
    address: '7 Avenue Albert Einstein, Sophia Antipolis',
    type: 'Magasin Bio',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6155,
    lon: 7.0635
  },
  {
    name: 'Salon de Thé Le Moment',
    address: '21 Rue de Chêne Vert, Sophia Antipolis',
    type: 'Salon de Thé',
    imageUrl: '../../assets/local.jpg',
    lat: 43.6175,
    lon: 7.0649
  }
  ];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      address: [''],
      radius: [10000] // Rayon par défaut de 10 km en mètres
    });
  }

  ngOnInit(): void {
    this.initMap();
  }

  // Initialiser la carte
  private initMap(): void {
    this.map = L.map('map').setView([43.6960, 7.2719], 12); // Centre sur Nice

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  // Demande la localisation de l'utilisateur et effectue une recherche
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.map.setView([lat, lon], 12);
          this.searchNearbyLocaux(lat, lon);
        },
        (error) => {
          console.error('Erreur de localisation', error);
          alert('Impossible de récupérer votre position.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  }

  // Recherche de locaux à proximité d'une position
  private searchNearbyLocaux(lat: number, lon: number): void {
    const radius = this.searchForm.value.radius || 10000; // Rayon de recherche par défaut

    // Filtrer les locaux par distance
    this.locaux = this.defaultLocaux.filter(local =>
      this.calculateDistance(lat, lon, local.lat, local.lon) <= radius
    );

    this.showLocauxList = this.locaux.length > 0; // Affiche la liste si des locaux sont trouvés
    this.clearMarkers(); // Efface les marqueurs existants
    this.displayLocauxOnMap(); // Affiche les locaux trouvés sur la carte
  }

  // Recherche par adresse avec géocodage
  searchByAddress(): void {
    const address = this.searchForm.value.address;
    const radius = this.searchForm.value.radius || 10000; // Rayon par défaut de 10 km

    // API de géocodage
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .subscribe((results: any) => {
        if (results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          this.map.setView([lat, lon], 12);
          this.searchNearbyLocaux(lat, lon);
        } else {
          alert('Adresse introuvable.');
        }
      });
  }

    localIcon = L.icon({
    iconUrl: '../../assets/store-3.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Affiche les locaux sur la carte avec des marqueurs et des popups
  private displayLocauxOnMap(): void {
    this.locaux.forEach(local => {
      const marker = L.marker([local.lat, local.lon], {icon:this.localIcon}).addTo(this.map);
      this.markers.push(marker);

      const popupContent = `
        <div style="text-align:center">
          <h4>${local.name}</h4>
          <p>${local.address}</p>
          <p>Type : ${local.type}</p>
          <img src="${local.imageUrl}" alt="${local.name}" style="width:100%; height:auto; border-radius:4px;">
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }

  // Efface les marqueurs de la carte
  private clearMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  // Calcul de la distance entre deux points géographiques
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
