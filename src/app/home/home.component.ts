import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "../login/login.component";
import { SignupComponent } from "../signup/signup.component";
import { AgmCoreModule } from '@agm/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule, LoginComponent, SignupComponent, GoogleMapsModule,],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLogin: boolean = true;

  constructor(public authService: AuthService) {}

  // Méthode pour basculer entre Connexion et Inscription
  toggleAuthForm() {
    this.isLogin = !this.isLogin;
  }

  // Méthode pour la connexion avec Google
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .catch((error) => {
        console.error('Erreur de connexion avec Google', error);
      });
  }

  // Méthode pour la déconnexion
  logout() {
    this.authService.logout()
      .catch((error) => {
        console.error('Erreur de déconnexion', error);
      });
  }

  latitude: number = 48.8566; // Latitude par défaut (Paris)
  longitude: number = 2.3522; // Longitude par défaut (Paris)
  zoom: number = 12; // Niveau de zoom par défaut

  events: { lat: number; lng: number; name: string }[] = [
    { lat: 48.8584, lng: 2.2945, name: 'Tour Eiffel - Concert' },
    { lat: 48.8566, lng: 2.3522, name: 'Centre-ville - Marché' },
    { lat: 48.8606, lng: 2.3376, name: 'Louvre - Expo' },
  ];

  mapOptions: google.maps.MapOptions = {
    center: { lat: this.latitude, lng: this.longitude },
    zoom: this.zoom,
  };
}
