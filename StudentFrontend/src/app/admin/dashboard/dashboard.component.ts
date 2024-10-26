import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Notification {
  id: number;
  title: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string | null = null; // Variable to hold the user's name
  userRole: string | null = null;  // Variable to hold the user's role
  totalStudents: number = 0;       // Variable to hold the total students count
  pendingLeaveRequests: number = 0; // Variable to hold pending leave requests count
  recentActivities: any[] = [];    // Variable to hold recent activities
  notifications: Notification[] = []; // Variable to hold notifications

  private apiUrl = 'http://localhost:5000/student/count'; // Replace with your API URL
  private activitiesApiUrl = 'http://localhost:5000/student/recentactivities'; // Replace with your recent activities API URL
  private notificationsApiUrl = 'http://localhost:5000/student/notifications'; // Replace with your notifications API URL
  private pendingLeaveApiUrl = 'http://localhost:5000/leaves/Count1'; // Updated to point to your pending leave count API

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Fetch user details from localStorage
      this.userName = localStorage.getItem('username');
      this.userRole = localStorage.getItem('userRole');
      console.log('User Name from localStorage:', this.userName); 
      console.log('User Role from localStorage:', this.userRole); 

      // Fetch total students count from API
      this.http.get<any>(this.apiUrl).subscribe(
        (data) => {
          if (data && data.total !== undefined) {
            this.totalStudents = data.total;
            console.log('Total Students:', this.totalStudents);
          } else {
            console.error('Unexpected API response:', data);
          }
        },
        (error) => {
          console.error('Error fetching total students:', error);
        }
      );

      // Fetch pending leave requests count from API
      this.http.get<{ pendingLeaveCount: number }>(this.pendingLeaveApiUrl).subscribe(
        (data) => {
          this.pendingLeaveRequests = data.pendingLeaveCount; // Use the pendingLeaveCount from API response
          console.log('Pending Leave Requests Count:', this.pendingLeaveRequests);
        },
        (error) => {
          console.error('Error fetching pending leave requests:', error);
        }
      );

      // Fetch recent activities from API
      this.http.get<any[]>(this.activitiesApiUrl).subscribe(
        (activities) => {
          this.recentActivities = activities; // Store fetched activities
          console.log('Recent Activities:', this.recentActivities);
        },
        (error) => {
          console.error('Error fetching recent activities:', error);
        }
      );

      // Fetch notifications from API
      this.fetchNotifications();
    }
  }

  fetchNotifications(): void {
    this.http.get<Notification[]>(this.notificationsApiUrl).subscribe(
      (notifications) => {
        this.notifications = notifications; // Store fetched notifications
        console.log('Notifications:', this.notifications);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  editNotification(notification: Notification): void {
    const notificationId = notification.id; // Use the ID from the notification object
    this.http.get<Notification>(`${this.notificationsApiUrl}/${notificationId}`).subscribe(
        (fetchedNotification) => {
            const updatedNotification = { ...fetchedNotification, title: 'Edited Notification' }; // Example edit logic
            this.http.put<Notification>(`${this.notificationsApiUrl}/${notificationId}`, updatedNotification).subscribe(
                () => {
                    console.log('Notification edited:', updatedNotification);
                },
                (error) => {
                    console.error('Error editing notification:', error);
                }
            );
        },
        (error) => {
            console.error('Error fetching notification:', error);
        }
    );
  }

  deleteNotification(notification: Notification): void {
    this.http.delete<void>(`${this.notificationsApiUrl}/${notification.id}`).subscribe(
      () => {
        this.notifications = this.notifications.filter((n) => n.id !== notification.id); // Remove from the notifications array
        console.log('Notification deleted:', notification.id);
      },
      (error) => {
        console.error('Error deleting notification:', error);
      }
    );
  }
}
