import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { ShopDetailsComponent } from '../shop-details/shop-details.component';
import * as L from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { AjouterEvenementComponent } from '../ajouter-evenement/ajouter-evenement.component';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MenuComponent } from "../menu/menu.component";
import { LocationLocauxComponent } from '../location-locaux/location-locaux.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    LoginComponent,
    SignupComponent,
    HttpClientModule,
    AjouterEvenementComponent,
    LocationLocauxComponent,
    MenuComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapContainer!: ElementRef;
  isLogin: boolean = true;

  map!: L.Map;

  isMapInitialized = false;

  showAjouterEvenement: boolean = false;

  modeAffichage: 'evenements' | 'locaux' = 'evenements'; // Valeur par défaut : recherche d'événements


  constructor(public authService: AuthService, private http: HttpClient, public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        
        setTimeout(() => {
          this.initMap();
          this.loadUserAndShops();
        }, 500);
        console.log('MAP EN COURS DE CHARGEMENT');
      }
    });
    
  }
  
  ngOnInit(): void {
    
  }

  private initMap(): void {

    const iconDefault = L.icon({
      iconUrl: '../../../assets/marker-icon.png',
      shadowUrl: '../../../assets/marker-shadow.png',
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage de l'icône
      popupAnchor: [1, -34], // Position de la popup par rapport à l'icône
      shadowSize: [41, 41], // Taille de l'ombre
    });
  
    // Remplacer l'icône par défaut de Leaflet
    L.Marker.prototype.options.icon = iconDefault;
  

    this.map = L.map('map', {
      center: [43.61736043171063, 7.064343879369045], // Centre de la France
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

     // Écouter les clics sur la carte pour mettre à jour les coordonnées dans le formulaire
     this.map.on('click', (e: L.LeafletMouseEvent) => {
      // Mise à jour des coordonnées dans le composant enfant `AjouterEvenementComponent`
      this.ajouterEvenementComponent?.mettreAJourCoordonnees(e.latlng.lat, e.latlng.lng);
    });

    // Définir la zone de recherche à la France
    const franceBoundingBox = {
      minX: -5.3173828125,
      minY: 41.32732632036622,
      maxX: 9.560546875,
      maxY: 51.12421275782688
    };

     // Ajouter la barre de recherche avec OpenStreetMapProvider
     const provider = new OpenStreetMapProvider({
      params: {
        viewbox: `${franceBoundingBox.minX},${franceBoundingBox.minY},${franceBoundingBox.maxX},${franceBoundingBox.maxY}`,
        bounded: 1,
        countrycodes: 'FR', // Code pays pour restreindre à la France
      },
    });

     const searchControl = GeoSearchControl({
       provider: provider,
       style: 'bar',
       showMarker: true,
       showPopup: true,
       marker: {
         icon: iconDefault,
         draggable: false,
       },
       maxMarkers: 1,
       retainZoomLevel: false,
       animateZoom: true,
       autoClose: true,
       searchLabel: 'Entrez une adresse',
       keepResult: true,
     });
 
     this.map.addControl(searchControl);


  }

  private async loadUserAndShops(): Promise<void> {
    try {
      const userLocation = await this.getUserLocation();
      console.log('Position de l\'utilisateur:', userLocation);
  
      // Centrer la carte sur la position de l'utilisateur
      this.map.setView([userLocation.lat, userLocation.lon], 15);
  
      // Ajouter un marqueur pour l'utilisateur
      L.marker([userLocation.lat, userLocation.lon])
        .addTo(this.map)
        .bindPopup('Vous êtes ici')
        .openPopup();
  
      // Recherche des commerces autour de la position de l'utilisateur
      this.searchNearbyShops(userLocation.lat, userLocation.lon);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position de l\'utilisateur', error);
  
      // Utilisation d'une position par défaut si la géolocalisation échoue
      const fallbackLocation = { lat: 43.61736577171462, lon: 7.064337173847 }; // Position par défaut à Londres
      console.log('Utilisation de la position de repli:', fallbackLocation);
  
      this.map.setView([fallbackLocation.lat, fallbackLocation.lon], 13);
  
      // Ajouter un marqueur pour la position de repli
      L.marker([fallbackLocation.lat, fallbackLocation.lon])
        .addTo(this.map)
        .bindPopup('MIAGE SOPHIA ANTIPOLIS')
        .openPopup();
  
      // Recherche des commerces autour de la position par défaut
      this.searchNearbyShops(fallbackLocation.lat, fallbackLocation.lon);
    }
  }


  toggleAfficherEvenements() {
    this.modeAffichage = 'evenements';
  }

  toggleAfficherLocaux() {
    this.modeAffichage = 'locaux';
  }
  

  private getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error('L\'utilisateur a refusé la demande de géolocalisation.');
                break;
              case error.POSITION_UNAVAILABLE:
                console.error('La localisation de l\'appareil est indisponible.');
                break;
              case error.TIMEOUT:
                console.error('Le service de localisation a expiré.');
                break;
              default:
                console.error('Erreur inconnue lors de la tentative de géolocalisation.');
                break;
            }
            reject(error);
          }
        );
      } else {
        reject(new Error('La géolocalisation n\'est pas prise en charge par ce navigateur.'));
      }
    });
  }

  private searchNearbyShops(lat: number, lon: number): void {
    const radius = 2000; // Rayon de recherche en mètres
    const overpassUrl = `https://overpass-api.de/api/interpreter`;
  
    const query = `
      [out:json];
      node
        ["shop"]
        (around:${radius},${lat},${lon});
      out body;
    `;
  
    const params = new HttpParams().set('data', query);
  
    this.http.get(overpassUrl, { params: params }).subscribe(
      (response: any) => {
  
        const shopIcon = L.icon({
          iconUrl: '../../../assets/store.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
  
        if (response && response.elements) {
          response.elements.forEach((element: any) => {
            console.log('Commerce trouvé:', element);
            if (element.lat && element.lon) {
              const shopName = element.tags.name || 'Nom inconnu';
              const shopType = element.tags.shop || 'Type inconnu';
              const address = element.tags['addr:street'] || 'Adresse inconnue';
              const email = element.tags['contact:email'] || 'Email inconnu';
              const longitude = element.lon;
              const latitude = element.lat;
  
              const marker = L.marker([element.lat, element.lon], { icon: shopIcon })
                .addTo(this.map)
                .on('click', () => {
                  this.openShopDetails({
                    name: shopName,
                    type: shopType,
                    address: address,
                    rating: Math.random() * 5, // Simulation d'une note
                    reviewsCount: Math.floor(Math.random() * 1000), // Simulation du nombre d'avis
                    phoneNumber: '+33 6 23 45 67 89', // Exemple statique
                    photoUrl: '../../assets/shop.png', // Image d'exemple
                    email: email,
                    long : longitude,
                    lat : latitude
                  });
                });
            }
          });
        } else {
          console.log('Aucun commerce trouvé.');
        }
      },
      (error) => {
        console.error('Erreur lors de la recherche des commerces à proximité', error);
      }
    );
  }
  
  private openShopDetails(data: any): void {
    this.dialog.open(ShopDetailsComponent, {
      width: '400px',
      data: data
    });
  }



  // Référence au composant enfant
  ajouterEvenementComponent!: AjouterEvenementComponent;

  // Méthode pour ajouter un événement sur la carte
  onEvenementAjoute(event: any): void {
    const eventIcon = L.icon({
      iconUrl: '../../../assets/banner.png',
      iconSize: [45, 45],
      iconAnchor: [16, 45],
      popupAnchor: [0, -45],
    });

    // Ajouter un marqueur sur la carte
    L.marker([event.latitude, event.longitude], {
      icon: eventIcon,
    })
      .addTo(this.map)
      .bindPopup(`
        <div>
          <h4>${event.name}</h4>
          <p>${event.description}</p>
          <p><strong>Date :</strong> ${new Date(event.date).toLocaleDateString()}</p>
        </div>
      `);
  }

  handleAjouterEvenement(event: any): void {
    if (this.map) {
      const { latitude, longitude, name, description } = event;

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(`
          <strong>${name}</strong><br>
          ${description ? description : 'Pas de description'}
        `)
        .openPopup();
    } else {
      console.error('La carte n\'est pas initialisée.');
    }
  }
  

  

  // Méthode pour basculer entre Connexion et Inscription
  toggleAuthForm() {
    this.isLogin = !this.isLogin;
  }

  // Méthode pour la connexion avec Google
  loginWithGoogle() {
    this.authService.loginWithGoogle().catch((error) => {
      console.error('Erreur de connexion avec Google', error);
    });
  }

  // Méthode pour la déconnexion
  logout() {
    this.authService.logout().catch((error) => {
      console.error('Erreur de déconnexion', error);
    });
  }

  toggleAjouterEvenement(): void {
    this.showAjouterEvenement = !this.showAjouterEvenement;
  }
}
