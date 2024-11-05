import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  // Méthode pour obtenir l'email de l'utilisateur connecté
  getUserEmail(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.email : null;
  }

  // Méthode pour l'inscription par email/mot de passe
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        // Rediriger vers la page de connexion après inscription
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Erreur d\'inscription', error);
      });
  }

  // Méthode pour la connexion par email/mot de passe
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Rediriger vers la page de bienvenue après connexion
        this.router.navigate(['/welcome']);
      })
      .catch((error) => {
        console.error('Erreur de connexion', error);
      });
  }

  // Méthode pour la connexion avec Google
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        // Rediriger vers la page de bienvenue après connexion réussie
        this.router.navigate(['/welcome']);
      })
      .catch((error) => {
        console.error('Erreur de connexion avec Google', error);
      });
  }

  // Méthode pour la déconnexion
  logout() {
    return signOut(this.auth)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Erreur de déconnexion', error);
      });
  }
}
