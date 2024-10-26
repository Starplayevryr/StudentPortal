import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

// Define the structure of the Notification object
interface Notification {
  _id: string;          
  title: string;        
  message: string;      
  scheduleDate: string; 
  sentBy: string;       
  class: string;        
  dateSent: string;     
}

interface Student {
  _id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  class: string;
  age: number;
  phno: number;
  address: string;
  role: string;
  photo: string;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})

export class Dashboard1Component implements OnInit {
  studentDetails: Student | null = null;
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  calendarDates: Date[] = [];
  notifications: Notification[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.generateCalendar(this.currentMonth, this.currentYear);
    this.fetchNotifications();
    this.fetchStudentDetails();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  generateCalendar(month: number, year: number): void {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    this.calendarDates = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDates.push(new Date(year, month, -i));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDates.push(new Date(year, month, day));
    }
  }

  fetchStudentDetails(): void {
    const registrationNumber = localStorage.getItem('registrationNumber');
    const authToken = localStorage.getItem('authToken');

    if (registrationNumber) {
      const apiUrl = `http://localhost:5000/notify/student-details?registrationNumber=${registrationNumber}`;
      this.http.get<Student>(apiUrl, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }).subscribe(
        (details) => {
          this.studentDetails = details;
        },
        (error) => {
          console.error('Error fetching student details', error);
          Swal.fire("Error", "Failed to fetch student details", "error");
        }
      );
    } else {
      Swal.fire("Error", "Registration number not found in local storage", "error");
    }
  }

  fetchNotifications(): void {
    const apiUrl = `http://localhost:5000/notify/notify`;
    this.http.get<Notification[]>(apiUrl).subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  isNotificationRelevant(notification: Notification): boolean {
    return notification.class === 'ALL' || notification.class === this.studentDetails?.class;
  }
}
