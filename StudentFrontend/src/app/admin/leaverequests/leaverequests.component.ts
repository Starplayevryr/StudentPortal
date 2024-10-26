import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaverequests',
  templateUrl: './leaverequests.component.html',
  styleUrls: ['./leaverequests.component.css']
})
export class LeaverequestsComponent implements OnInit {
  leaveRequests: any[] = [];
  private apiUrl = 'http://localhost:5000/leaves/'; // Base API URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAllLeaveRequests();  // Fetch all leave requests on component initialization
  }

  // Fetches all leave requests from the backend
  fetchAllLeaveRequests() {
    this.http.get<any>(`${this.apiUrl}leave`).subscribe(
      response => {
        this.leaveRequests = response.leaves; // Expecting the backend to return a "leaves" array
      },
      error => {
        console.error('Error fetching leave requests:', error);
      }
    );
  }

  // Approves a leave request
  approveLeave(leaveId: string) {
    this.updateLeaveStatus(leaveId, 'Approved');
  }

  // Rejects a leave request
  rejectLeave(leaveId: string) {
    this.updateLeaveStatus(leaveId, 'Rejected');
  }

  // Updates the leave status (either Approved or Rejected)
  updateLeaveStatus(leaveId: string, status: string) {
    this.http.put<any>(`${this.apiUrl}leave/${leaveId}`, { status }).subscribe(
      response => {
        console.log('Leave status updated:', response);
        this.fetchAllLeaveRequests(); // Refresh the list after updating
      },
      error => {
        console.error('Error updating leave status:', error);
      }
    );
  }
}

