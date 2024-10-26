import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  admin: Admin | null = null; // Store the admin data here
  apiUrl = 'http://localhost:5000/admin/profile/'; // Adjusted API URL
  loading: boolean = true; // Loading state

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch the registration number from localStorage
    const registrationNumber = localStorage.getItem('registrationNumber');

    if (registrationNumber) {
      this.fetchAdminDetails(registrationNumber);
    } else {
      console.error('Registration number not found in localStorage');
      this.loading = false; // Stop loading if registration number is not found
    }
  }

  fetchAdminDetails(registrationNumber: string): void {
    this.http.get<Admin>(`${this.apiUrl}${registrationNumber}`).subscribe(
      (data: Admin) => {
        this.admin = data; // Set the admin data
        
        // Make the profile photo URL absolute
        if (this.admin.profilePhoto) {
          this.admin.profilePhoto = `http://localhost:5000/${this.admin.profilePhoto}`;
        }
        
        console.log('Admin Data:', this.admin); // Log admin data to check profile photo URL
        
        this.loading = false; // Stop loading when data is fetched
      },
      (error) => {
        console.error('Error fetching admin details:', error);
        this.loading = false; // Stop loading in case of an error
      }
    );
  }
}

// Define the Admin interface here
interface Admin {
  registrationNumber: string;
  email: string;
  phone: string;
  address: string;
  adminLevel: string;
  profilePhoto?: string; // Optional if not always available
}
