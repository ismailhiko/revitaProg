import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import * as L from 'leaflet';

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
    GoogleMapsModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: false }) mapContainer!: ElementRef;
  isLogin: boolean = true;

  map!: L.Map;

  isMapInitialized = false;

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        
        setTimeout(() => {
          this.initMap();
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
      center: [51.505, -0.09], // Latitude, Longitude
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    L.marker([51.505, -0.09])
      .addTo(this.map)
      .bindPopup('Hello from London!')
      .openPopup();
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
}
