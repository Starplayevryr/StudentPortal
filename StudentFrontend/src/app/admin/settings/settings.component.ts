import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  adminForm: FormGroup;
  registrationNumber: string | undefined;
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize form
    this.adminForm = this.fb.group({
      registrationNumber: [{ value: '', disabled: true }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      adminLevel: ['', Validators.required],
      profilePhoto: ['']
    });
  }

  ngOnInit(): void {
    // Get registration number from localStorage
    this.registrationNumber = localStorage.getItem('registrationNumber') || '';

    if (this.registrationNumber) {
      this.fetchAdminDetails(this.registrationNumber); // Fetch admin details if the number exists
    } else {
      console.error('Registration number not found in localStorage');
    }
  }

  fetchAdminDetails(registrationNumber: string): void {
    this.http.get(`http://localhost:5000/admin/profile/${registrationNumber}`).subscribe(
      (data: any) => {
        this.adminForm.patchValue(data.admin);
      },
      (error) => {
        console.error('Error fetching admin details', error);
      }
    );
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Form Incomplete',
        text: 'Please fill out all required fields.'
      });
      return; // Prevent submission if the form is invalid
    }

    const formData = new FormData();

    Object.keys(this.adminForm.value).forEach((key) => {
      formData.append(key, this.adminForm.value[key]);
    });

    if (this.file) {
      formData.append('profilePhoto', this.file);
    }

    this.http.put(`http://localhost:5000/admin/profile/${this.registrationNumber}`, formData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: response.message,
        }).then(() => {
          this.router.navigate(['/dashboard']); // Navigate to the dashboard or any other route
        });
      },
      (error) => {
        console.error('Error updating admin profile', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update admin profile',
        });
      }
    );
  }
}
