import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2'; // Import SweetAlert2

interface LeaveRequest {
  registrationNumber: string;
  leaveType: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  status?: string; // Optional since it may not be set initially
}

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent {
  leaveRequest: LeaveRequest = {
    registrationNumber: '',
    leaveType: '',
    reason: '',
    startDate: new Date(),
    endDate: new Date(),
  };

  private apiUrl = 'http://localhost:5000/leaves/'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to handle form submission
  submitLeaveRequest() {
    this.http.post<LeaveRequest>(this.apiUrl, this.leaveRequest).subscribe(response => {
      console.log('Leave request submitted:', response);

      // Use SweetAlert2 to show a success message
      Swal.fire({
        title: 'Success!',
        text: 'Leave request submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      // Optionally reset the form or show a success message
      this.resetForm();
    }, error => {
      console.error('Error submitting leave request:', error);

      // Use SweetAlert2 to show an error message
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting your leave request. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  // Optional: Reset the leave request form after submission
  resetForm() {
    this.leaveRequest = {
      registrationNumber: '',
      leaveType: '',
      reason: '',
      startDate: new Date(),
      endDate: new Date(),
    };
  }
}
