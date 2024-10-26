import { Component, OnInit } from '@angular/core';
import { DarkModeService } from './dark-mode.service'; // Adjust the path as needed
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StudentFrontend';
  apiUrl = 'https://student-portal-jade-pi.vercel.app'; // Your Vercel API URL
  /*
  title = 'StudentFrontend';
  constructor(private darkModeService: DarkModeService) {}

  ngOnInit() {
    this.darkModeService.darkMode$.subscribe(isDarkMode => {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }*/
}
