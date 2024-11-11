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
  defaultLocaux: any[] = [
    {
      name: 'Boulangerie du Vieux Nice',
      address: '15 Rue Droite, Nice',
      type: 'Boulangerie',
      imageUrl: '../assets/local.jpg', // Remplacez par une URL d'image réelle si possible
      lat: 43.6977,
      lon: 7.2719
    },
    {
      name: 'Librairie de la Place',
      address: '23 Place Massena, Nice',
      type: 'Librairie',
      imageUrl: '../assets/local.jpg',
      lat: 43.6954,
      lon: 7.2716
    },
    {
      name: 'Café des Arts',
      address: '2 Rue de la Préfecture, Nice',
      type: 'Café',
      imageUrl: '../assets/local.jpg',
      lat: 43.6961,
      lon: 7.2733
    },
    {
      name: 'Épicerie Locale',
      address: '8 Rue Saint-François de Paule, Nice',
      type: 'Épicerie',
      imageUrl: '../assets/local.jpg',
      lat: 43.6958,
      lon: 7.2730
    },
    {
      name: 'Pharmacie Centrale',
      address: '5 Rue Gioffredo, Nice',
      type: 'Pharmacie',
      imageUrl: '../assets/local.jpg',
      lat: 43.6981,
      lon: 7.2706
    },
    {
      name: 'Bijouterie du Centre',
      address: '10 Rue de l’Opéra, Nice',
      type: 'Bijouterie',
      imageUrl: '../assets/local.jpg',
      lat: 43.6967,
      lon: 7.2757
    },
    {
      name: 'Restaurant Le Niçois',
      address: '6 Rue de la Boucherie, Nice',
      type: 'Restaurant',
      imageUrl: '../assets/local.jpg',
      lat: 43.6951,
      lon: 7.2738
    },
    {
      name: 'Fleuriste Au Soleil',
      address: '18 Rue du Marché, Nice',
      type: 'Fleuriste',
      imageUrl: '../assets/local.jpg',
      lat: 43.6954,
      lon: 7.2722
    },
    {
      name: 'Magasin Bio Naturellement',
      address: '7 Avenue Félix Faure, Nice',
      type: 'Magasin Bio',
      imageUrl: '../assets/local.jpg',
      lat: 43.6975,
      lon: 7.2712
    },
    {
      name: 'Salon de Thé La Pause',
      address: '21 Rue de l’Abbaye, Nice',
      type: 'Salon de Thé',
      imageUrl: '../assets/local.jpg',
      lat: 43.6963,
      lon: 7.2744
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

  // Affiche les locaux sur la carte avec des marqueurs et des popups
  private displayLocauxOnMap(): void {
    this.locaux.forEach(local => {
      const marker = L.marker([local.lat, local.lon]).addTo(this.map);
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
