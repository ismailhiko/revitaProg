import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  signUp() {
    this.authService.signUp(this.email, this.password);
  }
}
