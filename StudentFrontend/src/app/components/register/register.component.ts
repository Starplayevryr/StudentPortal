import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup; // Using non-null assertion

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", Validators.required], // Added username field
      registrationNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      phno: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]], // Validate for 10-digit phone numbers
      role: ["student", Validators.required], // Default role to 'student'
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const apiUrl = 'http://localhost:5000/api/register'; // Replace with your API endpoint

      // Prepare the form data, converting phno to a number
      const formData = {
        ...this.form.value,
        phno: Number(this.form.value.phno), // Convert phno to number
      };

      console.log(formData); // Log the form values

      this.http.post(apiUrl, formData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Registration Successful!',
            text: 'You have been registered successfully.',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['/login']); // Redirect to login page
          });
        },
        error: (error) => {
          console.error('Error response:', error); // Log the complete error response
          Swal.fire({
            title: 'Registration Failed!',
            text: error.error.message || 'An error occurred during registration.',
            icon: 'error'
          });
        }
      });
    } else {
      this.showValidationErrors(); // Implement this function to show validation errors
    }
  }

  showValidationErrors(): void {
    // You can iterate through the form controls and show specific validation messages
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control?.invalid) {
        control.markAsTouched(); // Mark the control as touched to show validation messages
      }
    });
  }
}
