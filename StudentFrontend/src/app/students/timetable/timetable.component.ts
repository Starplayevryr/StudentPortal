import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Ensure HttpClient is imported correctly
import Swal from 'sweetalert2';

interface Timetable {
  class: string;
  fileUrl: string;
  uploadedAt: Date;
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit {
  selectedClass: string = ''; // Initialize with an empty string
  classes: any[] = [
    { value: '', label: 'Choose Class' },  // Placeholder option
    { value: '1st sem', label: '1st Semester' },
    { value: '2nd sem', label: '2nd Semester' },
    { value: '3rd sem', label: '3rd Semester' },
    { value: '4th sem', label: '4th Semester' },
    { value: '5th sem', label: '5th Semester' },
    { value: '6th sem', label: '6th Semester' },
    { value: '7th sem', label: '7th Semester' },
    { value: '8th sem', label: '8th Semester' },
  ];
  timetables: Timetable[] = [];

  // Inject HttpClient
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Any initialization logic if required
  }
  fetchTimetable(): void {
    if (!this.selectedClass) {
      Swal.fire('Error', 'Please select a class.', 'error');
      return;
    }
  
    // Clear the timetables array before making the API call to avoid showing old data
    this.timetables = [];
  
    const apiUrl = `http://localhost:5000/student/timetables/${this.selectedClass}`;
    
    // Make the API call to fetch timetables for the selected class
    this.http.get<Timetable[]>(apiUrl).subscribe(
      (response: Timetable[]) => {
        console.log('API Response:', response); // Debugging the API response
  
        if (!response || response.length === 0) {
          Swal.fire('No Timetable Found', `No timetable available for ${this.selectedClass}`, 'warning');
        } else {
          this.timetables = response;
          Swal.fire('Success', `Timetables for ${this.selectedClass} fetched successfully`, 'success');
        }
      },
      (error) => {
        console.error('Error fetching timetable:', error); // Log the full error response
        Swal.fire('Error', 'An error occurred while fetching the timetable. Please try again later.', 'error');
      }
    );
  }
  
  // Function to allow students to download the timetable
  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = 'timetable.pdf';  // This will force the browser to download the file
    link.click();
  }
}
