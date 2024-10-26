import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { Dashboard1Component } from './students/dashboard1/dashboard1.component';
import { StudentrecordsComponent } from './admin/studentrecords/studentrecords.component';
import { StudentenrollmentComponent } from './admin/studentenrollment/studentenrollment.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { Navbar1Component } from './students/navbar1/navbar1.component';
import { LeaveComponent } from './students/leave/leave.component';
import { StatusComponent } from './students/status/status.component';
import { LeaverequestsComponent } from './admin/leaverequests/leaverequests.component';
import { ExamTimetableComponent } from './admin/exam-timetable/exam-timetable.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { TimetableComponent } from './students/timetable/timetable.component';
import { PostprofileComponent } from './admin/postprofile/postprofile.component';
const routes: Routes = [
  { path: '',redirectTo: '/home', pathMatch: 'full' },
   // redirect to home on empty path
  { path: 'home', component:HomeComponent },
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  { path: 'dashboard', component: DashboardComponent }, 
  {path:'students',component:StudentrecordsComponent},
  {path:'enrollment',component:StudentenrollmentComponent}, 
  {path:'notifications',component:NotificationsComponent},// Admin route
  { path: 'dashboard1', component: Dashboard1Component },
  {path:'navbar1',component:Navbar1Component},
  {path:'leave',component:LeaveComponent},
  {path:'status',component:StatusComponent},
  {path:'leaverequests',component:LeaverequestsComponent},
  {path:'examtimetable',component:ExamTimetableComponent},
  {path:'profile',component:ProfileComponent},
  {path:'settings',component:SettingsComponent},
  {path:'timetable',component:TimetableComponent},
  {path:'postprofile',component:PostprofileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
