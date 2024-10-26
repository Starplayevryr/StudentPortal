import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-studentrecords',
  templateUrl: './studentrecords.component.html',
  styleUrls: ['./studentrecords.component.css']
})
export class StudentrecordsComponent implements OnInit {
  students: any[] = []; // Array to hold the student data
  filteredStudents: any[] = []; // Array to hold filtered students
  searchQuery: string = ''; // Search query for filtering students

  private apiUrl = 'http://localhost:5000/student/students'; // Your API endpoint

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchStudents(); // Call the function to fetch students
  }

  fetchStudents() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.students = data.map(student => ({
          ...student,
          photo: student.photo ? `http://localhost:5000/${student.photo}` : null, // Make URL absolute
        }));
        this.filteredStudents = this.students; // Initially display all students
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  // Method to filter students based on the search query
  filterStudents() {
    this.filteredStudents = this.students.filter(student => {
      const registrationMatch = student.registrationNumber.toLowerCase().includes(this.searchQuery.toLowerCase());
      const emailMatch = student.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return registrationMatch || emailMatch; // Return true if either matches
    });
  }

  // Delete the selected student
  deleteStudent(registrationNumber: string) {
    const confirmDelete = confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      this.http.delete(`${this.apiUrl}/${registrationNumber}`).subscribe(
        () => {
          console.log('Student deleted successfully');
          this.fetchStudents(); // Refresh the list after deletion
        },
        (error) => {
          console.error('Error deleting student', error);
        }
      );
    }
  }
}
