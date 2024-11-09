import { Injectable } from '@angular/core';
import { Auth, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private router: Router) {
    // Écouter les changements d'état d'authentification
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): Observable<boolean> {
    return this.userSubject.asObservable().pipe(map(user => !!user));
  }

  // Méthode pour obtenir l'email de l'utilisateur connecté
  getUserEmail(): Observable<string | null> {
    return this.userSubject.asObservable().pipe(
      map(user => user ? user.email : null)
    );
  }

  // Méthode pour l'inscription par email/mot de passe
  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      // Rediriger vers la page de connexion après inscription
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur d\'inscription', error);
    }
  }

  // Méthode pour la connexion par email/mot de passe
  // async login(email: string, password: string): Promise<void> {
  //   try {
      
  //   const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
  //   console.log('Connexion réussie, utilisateur :', userCredential.user);
    
  //     // Rediriger vers la page de bienvenue après connexion
  //     this.router.navigate(['/welcome']);
  //   } catch (error) {
  //     console.error('Erreur de connexion', error);
  //   }
  // }
  async login(email: string, password: string): Promise<void> {
    try {
      console.log('Tentative de connexion à Firebase');
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Connexion réussie, utilisateur :', userCredential.user);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      console.error('Code d\'erreur Firebase:', error.code);
      console.error('Message d\'erreur Firebase:', error.message);
    }
  }
  

  // Méthode pour la connexion avec Google
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      // Rediriger vers la page de bienvenue après connexion réussie
      await this.router.navigate(['/welcome']);
    } catch (error) {
      console.error('Erreur de connexion avec Google', error);
    }
  }

  // Méthode pour la déconnexion
  // Méthode pour la déconnexion
async logout(): Promise<void> {
  try {
    await signOut(this.auth);
    console.log('Utilisateur déconnecté');
    // Attendre un court instant avant la navigation pour s'assurer que l'état est bien mis à jour

      this.router.navigate(['/login']);
  } catch (error) {
    console.error('Erreur de déconnexion', error);
  }
}

}
