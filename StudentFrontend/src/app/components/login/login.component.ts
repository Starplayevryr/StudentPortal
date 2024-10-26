import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Corrected to styleUrls
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      registrationNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["student", Validators.required]  // Default role as student
    });
  }

  submit(): void {
    const user = this.form.getRawValue();

    // Check for form validity
    if (this.form.invalid) {
      Swal.fire("Error", "Please fill all fields correctly", "error");
      return;
    }

    this.isLoading = true;  // Set loading state

    // Make an HTTP POST request to login
   // Make an HTTP POST request to login
this.http.post("http://localhost:5000/api/login", user, {
  withCredentials: true
})
.subscribe((response: any) => {
  // Check if the response is valid and contains the expected user details
  if (response && response.token && response.user) {
    // Store token and user details upon successful login
    localStorage.setItem('authToken', response.token);
    
    const { role, username, registrationNumber } = response.user; // Destructure role and username from user object
   
    // Store user details in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('registrationNumber', registrationNumber);
    

    console.log('User Role:', role);
    console.log('Username:', username);
    console.log('Registration Number:', registrationNumber);

    // Success message and then navigate based on role
    Swal.fire("Success", "Logged in successfully!", "success")
      .then(() => {
        if (role === 'admin') {
          this.router.navigate(['/dashboard']); // Navigate to Admin Dashboard
        } else if (role === 'student') {
          this.router.navigate(['/dashboard1']); // Navigate to Student Dashboard
        }
      });
  } else {
    Swal.fire("Error", "Invalid login response", "error");
  }
}, (err) => {
  Swal.fire("Error", err.error.message || "Login failed", "error");
})
.add(() => {
  this.isLoading = false; // Reset loading state after request completes
});

  }
}