import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-studentenrollment',
  templateUrl: './studentenrollment.component.html',
  styleUrls: ['./studentenrollment.component.css']
})
export class StudentenrollmentComponent implements OnInit {
  studentForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialize the form with form controls
    this.studentForm = this.fb.group({
      registrationNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      class: ['', Validators.required],
      age: ['', Validators.required],
      phno: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Handle file input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.selectedFile = input.files[0];
    }
  }

  // Form submit handler
  onSubmit() {
    if (this.studentForm.valid && this.selectedFile) {
      const formData = new FormData();

      // Append form fields
      formData.append('registrationNumber', this.studentForm.get('registrationNumber')?.value);
      formData.append('firstName', this.studentForm.get('firstName')?.value);
      formData.append('lastName', this.studentForm.get('lastName')?.value);
      formData.append('email', this.studentForm.get('email')?.value);
      formData.append('class', this.studentForm.get('class')?.value);
      formData.append('age', this.studentForm.get('age')?.value);
      formData.append('phno', this.studentForm.get('phno')?.value);
      formData.append('address', this.studentForm.get('address')?.value);
      formData.append('photo', this.selectedFile); // Append the selected file

      // Send POST request to the backend API
      this.http.post('http://localhost:5000/student/students', formData).subscribe(
        (response: any) => {
          console.log('Student created successfully', response);
          Swal.fire({
            icon: 'success',
            title: 'Enrollment Successful',
            text: 'The student has been enrolled successfully!',
            confirmButtonText: 'OK'
          });
          this.studentForm.reset(); // Clear the form after successful submission
        },
        (error) => {
          console.error('Error creating student', error);
          Swal.fire({
            icon: 'error',
            title: 'Enrollment Failed',
            text: 'There was an error enrolling the student. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill in all required fields and upload a photo.',
        confirmButtonText: 'OK'
      });
    }
  }
}
