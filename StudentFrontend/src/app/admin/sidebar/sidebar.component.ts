// src/app/admin/sidebar/sidebar.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = false;
  userName: string | null = null;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only access localStorage if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.userName = localStorage.getItem('userName');
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  signOut() {
    if (isPlatformBrowser(this.platformId)) {
        // Remove the user name and authentication token from local storage
        localStorage.removeItem('userName');
        localStorage.removeItem('authToken'); // Replace 'authToken' with your actual token key
    }
    
    // Navigate to the login page without replacing the URL
    this.router.navigate(['/login']);
}
}
