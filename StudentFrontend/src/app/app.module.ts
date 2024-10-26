import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

import { ReportsComponent } from './admin/reports/reports.component';
import { Dashboard1Component } from './students/dashboard1/dashboard1.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { StudentrecordsComponent } from './admin/studentrecords/studentrecords.component';
import { CommonModule } from '@angular/common';
import { StudentenrollmentComponent } from './admin/studentenrollment/studentenrollment.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { Navbar1Component } from './students/navbar1/navbar1.component';
import { LeaveComponent } from './students/leave/leave.component';
import { TimetableComponent } from './students/timetable/timetable.component';
import { StatusComponent } from './students/status/status.component';
import { ExamTimetableComponent } from './admin/exam-timetable/exam-timetable.component';
import { LeaverequestsComponent } from './admin/leaverequests/leaverequests.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { PostprofileComponent } from './admin/postprofile/postprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ReportsComponent,
    Dashboard1Component,
    SidebarComponent,
    TimetableComponent,
    StudentrecordsComponent,
    StudentenrollmentComponent,
    NotificationsComponent,
    Navbar1Component,
    LeaveComponent,
    StatusComponent,
    ExamTimetableComponent,
    LeaverequestsComponent,
    ProfileComponent,
    SettingsComponent,
    PostprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
   CommonModule
   

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
