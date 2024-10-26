import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

interface Notification {
  id: string;
  title: string;
  message: string;
  class: string;
  type: string;
  scheduleDate?: string;
  _id?: string; //
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  notifications: Notification[] = [];
  apiUrl = 'http://localhost:5000/student/notifications'; // Your API endpoint
  token: string | undefined; // Store token here
  selectedNotification: Notification | null = null; // For editing selected notification

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Inject the Router service
  ) {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      class: ['', Validators.required],
      type: ['', Validators.required],
      scheduleDate: [''] // Optional field for scheduling the notification
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }
    this.fetchNotifications(); // Load notifications on component init
  }

  fetchNotifications(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.get<Notification[]>(this.apiUrl, { headers }).subscribe(
      (response: Notification[]) => {
        this.notifications = response.map((notification: Notification) => ({
          id: notification._id || '', // Fallback to empty string if undefined
          title: notification.title,
          message: notification.message,
          class: notification.class,
          type: notification.type,
          scheduleDate: notification.scheduleDate
        }));
        console.log('Fetched notifications:', this.notifications);
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  onSubmitNotification(): void {
    if (this.notificationForm.valid) {
      const notificationData = this.notificationForm.value;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      });

      // Check if a notification is selected and that it has a valid ID
      if (this.selectedNotification) {
        // Ensure that the selected notification has a valid ID
        const id = this.selectedNotification.id;

        if (!id) {
          // Log and show an error message if ID is missing
          console.error('No ID found for selected notification.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to update notification. No valid ID found.',
          });
          return; // Exit early
        }

        // Proceed with the update request using the valid ID
        this.http.put(`${this.apiUrl}/${id}`, notificationData, { headers }).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Notification updated successfully!',
            });
            this.fetchNotifications(); // Refresh the list of notifications
            this.cancelEdit(); // Reset the selected notification
          },
          (error) => this.handleError(error) // Handle error response
        );
      } else {
        // If no notification is selected, create a new one
        this.http.post(this.apiUrl, notificationData, { headers }).subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Notification created successfully!',
            });
            this.fetchNotifications(); // Refresh notifications
            this.notificationForm.reset(); // Reset the form
          },
          (error) => this.handleError(error) // Handle error response
        );
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill out all required fields.',
      });
    }
  }

  editNotification(notification: Notification): void {
    console.log('Editing notification:', notification);
    this.selectedNotification = notification;
    console.log('Selected Notification:', this.selectedNotification);

    // Patch form values with the selected notification details
    this.notificationForm.patchValue(notification);
  }

  cancelEdit(): void {
    this.selectedNotification = null;
    this.notificationForm.reset();
  }

  confirmDelete(notification: Notification): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.delete(`${this.apiUrl}/${notification.id}`, { headers }).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Notification has been deleted.',
        });
        this.fetchNotifications(); // Refresh notifications after deletion
      },
      (error) => this.handleError(error) // Handle error response
    );
  }

  handleError(error: any): void {
    console.error('Error occurred', error);
    if (error.status === 401) {
      Swal.fire({
        icon: 'warning',
        title: 'Session expired',
        text: 'Please log in again.',
      }).then(() => {
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  }
}
