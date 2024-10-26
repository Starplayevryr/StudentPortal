import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar1',
  templateUrl: './navbar1.component.html',
  styleUrls: ['./navbar1.component.css']
})
export class Navbar1Component {
localStorage: any;
   // Use string | null since localStorage can return null

   constructor(private router: Router) {}

  signOut(event: Event) {
    event.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('registrationNumber'); // Optionally clear the registration number
    this.router.navigate(['/login']);
  }
}
