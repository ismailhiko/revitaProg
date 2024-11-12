import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, // Conserve les providers existants dans appConfig
    provideNativeDateAdapter(), // Fournisseur pour l'adaptateur de date natif
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Facultatif : Définit la langue française pour le datepicker
  ]
}).catch((err) => console.error(err));
