import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
 /* private darkModeSubject = new BehaviorSubject<boolean>(false); // Default to light mode
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    const darkMode = localStorage.getItem('darkMode');
    this.darkModeSubject.next(darkMode === 'true');
  }

  toggleDarkMode() {
    const currentMode = this.darkModeSubject.getValue();
    this.darkModeSubject.next(!currentMode);
    localStorage.setItem('darkMode', (!currentMode).toString());
  }*/
}
