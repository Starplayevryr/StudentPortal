import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  leaveRequests: any[] = [];
  upcomingLeaveRequests: any[] = [];
  ongoingLeaveRequests: any[] = []; // New array for ongoing leave requests
  registrationNumber: string | null = null;
  leaveRequestCount: number = 0; // Count of leave requests

  private apiUrl = 'http://localhost:5000/leaves/leave/'; // API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Retrieve the registration number from localStorage
    this.registrationNumber = localStorage.getItem('registrationNumber');
    console.log('Retrieved Registration Number:', this.registrationNumber); // Debug log

    this.fetchLeaveRequests(); // Fetch requests after setting registration number
  }

  fetchLeaveRequests() {
    if (this.registrationNumber) {
      this.http.get<any>(`${this.apiUrl}${this.registrationNumber}`).subscribe(
        response => {
          this.leaveRequests = response.leaves; // Adjust based on your API response
          this.filterUpcomingRequests(); // Call the filter function after fetching
          this.filterOngoingRequests(); // Call the new ongoing filter function
          this.leaveRequestCount = this.leaveRequests.length; // Count total leave requests
        },
        error => {
          console.error('Error fetching leave requests:', error);
        }
      );
    } else {
      console.error('Registration number is undefined.');
    }
  }

  // Filter for upcoming leave requests (start date today or after)
  filterUpcomingRequests() {
    const currentDate = new Date();

    // Filter for upcoming leave requests (start dates today or after)
    this.upcomingLeaveRequests = this.leaveRequests.filter(request => {
      const startDate = new Date(request.startDate); // Parse startDate of each leave request
      return startDate >= currentDate; // Keep requests that start today or in the future
    });

    // Optional: Remove requests that are older than one month
    this.leaveRequests = this.leaveRequests.filter(request => {
      const startDate = new Date(request.startDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1); // Subtract one month from current date
      return startDate >= oneMonthAgo; // Keep requests within the last month
    });

    // Count total leave requests for display
    this.leaveRequestCount = this.leaveRequests.length; // Count total leave requests
  }

  // New method to filter ongoing leave requests
  filterOngoingRequests() {
    const currentDate = new Date();

    // Filter for ongoing leave requests (start date in the past and end date in the future)
    this.ongoingLeaveRequests = this.leaveRequests.filter(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      return startDate <= currentDate && endDate >= currentDate; // Ongoing if start date is past and end date is future
    });
  }
}
