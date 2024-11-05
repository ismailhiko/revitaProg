import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms'; // Importer ReactiveFormsModule

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

  constructor(private authService: AuthService) {}

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if (email && password) {
      this.authService.login(email, password);
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}