import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms'; // Importer ReactiveFormsModule
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   // Déclaration du FormGroup avec deux FormControls
   loginForm = new FormGroup({
    email: new FormControl(''),   // Initialise l'email avec une chaîne vide
    password: new FormControl('') // Initialise le mot de passe avec une chaîne vide
  });
  router: any;

  constructor(private authService: AuthService, private auth: Auth) {}

  // login() {
  //   const email = this.loginForm.value.email;
  //   const password = this.loginForm.value.password;
  //   if (email && password) {
  //     this.authService.login(email, password);
  //   }
  // }

  // loginWithGoogle() {
  //   this.authService.loginWithGoogle();
  // }

  async login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    

    if (email && password) {
      try {
        await this.authService.login(email, password);
        // Vous pouvez ajouter une notification ou autre traitement après la connexion réussie
        console.log('Connexion réussie');
      } catch (error) {
        // Gestion des erreurs ici, par exemple en affichant un message d'erreur à l'utilisateur
        console.error('Erreur lors de la connexion', error);
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      console.log('Connexion Google réussie');
    } catch (error) {
      // Gestion des erreurs pour la connexion avec Google
      console.error('Erreur lors de la connexion avec Google', error);
    }
  }
}