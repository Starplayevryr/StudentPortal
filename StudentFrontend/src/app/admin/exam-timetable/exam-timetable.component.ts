import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-timetable',
  templateUrl: './exam-timetable.component.html',
  styleUrls: ['./exam-timetable.component.css']  // Make sure this is "styleUrls" instead of "styleUrl"
})
export class ExamTimetableComponent {
  timetables: any[] = [];
  selectedFile: File | null = null;
  selectedClass: string = '';

  constructor(private http: HttpClient) {}

  // File selection handler
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Form submission handler
  onSubmit() {
    if (this.selectedFile && this.selectedClass) {
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      const validFormats = ['pdf', 'doc', 'docx']; // Add valid file extensions

      if (!validFormats.includes(fileExtension!)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid file format',
          text: 'Please upload a valid file in PDF, DOC, or DOCX format!',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('class', this.selectedClass);

      this.http.post('http://localhost:5000/student/upload-timetable', formData)
        .subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Timetable Uploaded',
              text: response.message,
            });
            this.loadTimetables();  // Reload timetables after successful upload
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: 'There was an error uploading the timetable. Please try again.',
            });
            console.error('Error uploading timetable', error);
          }
        );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please select a class and a file before uploading!',
      });
    }
  }

  // Load timetables from the backend
  loadTimetables() {
    this.http.get('http://localhost:5000/student/get-timetable')
      .subscribe(
        (response: any) => {
          this.timetables = response.timetables || [];
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load timetables.',
          });
          console.error('Error fetching timetables', error);
        }
      );
  }

  // Initialize timetables on component load
  ngOnInit() {
    this.loadTimetables();
  }
}
