import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-postprofile',
  templateUrl: './postprofile.component.html',
  styleUrls: ['./postprofile.component.css']
})
export class PostprofileComponent {
  adminForm: FormGroup;
  selectedFile: File | null = null; // To hold the selected file
  userExists: boolean = false; // Track if user exists

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the form
    this.adminForm = this.fb.group({
      registrationNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      adminLevel: ['', Validators.required],
      profilePhoto: [null] // Optional since file input will not be used in form control
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onRegistrationNumberChange() {
    const registrationNumber = this.adminForm.get('registrationNumber')?.value;
    if (registrationNumber) {
      this.http.get(`http://localhost:5000/api/users/${registrationNumber}`).subscribe(
        (user: any) => {
          if (user) {
            this.userExists = true; // Set userExists to true if user is found
            // Pre-fill the form fields with user data
            this.adminForm.patchValue({
              email: user.email,
              phone: user.phone,
              address: user.address,
              adminLevel: user.adminLevel // Adjust based on your model
            });

            // Show a message that the user already exists
            Swal.fire({
              title: 'User Exists!',
              text: 'This registration number is already associated with an account.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            this.userExists = false; // No user found
          }
        },
        (error) => {
          console.error('Error fetching user data', error);
          // Optionally handle error response
        }
      );
    } else {
      this.userExists = false; // Reset if the input is empty
    }
  }

  onSubmit() {
    if (this.adminForm.valid) {
      const formData = new FormData();
      // Append form data
      Object.keys(this.adminForm.value).forEach(key => {
        formData.append(key, this.adminForm.value[key]);
      });

      // Append the file if selected
      if (this.selectedFile) {
        formData.append('profilePhoto', this.selectedFile);
      }

      // Make the POST request to the backend
      this.http.post('http://localhost:5000/admin/profile', formData).subscribe(
        (response) => {
          console.log('Admin created successfully', response);
          // Show success message with SweetAlert2
          Swal.fire({
            title: 'Success!',
            text: 'Admin profile created successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Optionally reset the form after successful submission
          this.adminForm.reset();
          this.userExists = false; // Reset user existence flag
        },
        (error) => {
          console.error('Failed to create admin', error);
          // Show error message with SweetAlert2
          Swal.fire({
            title: 'Error!',
            text: 'Failed to create admin profile. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      // Show validation error message
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
