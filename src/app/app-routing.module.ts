import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { HomeComponent } from './home/home.component';
import { DailyWorkingHoursComponent } from './time-track/daily-working-hours/daily-working-hours.component';
import { SalesResultComponent } from './sales/sales-result/sales-result.component';
import { DailyReportComponent } from './report/daily-report/daily-report.component';
import { MessageComponent } from './communication/message/message.component';
import { RewardCompetionComponent } from './reward-competion/reward-competion.component';
import { PlacementComponent } from './placement/placement.component';
import { LoginComponent } from './login/login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';

const routes: Routes = [
  { path: '',  component: IntroComponent, pathMatch: 'full' },
  { path: 'home',  component: HomeComponent, pathMatch: 'full' },
  { path: 'dailywork',  component: DailyWorkingHoursComponent, pathMatch: 'full' },
  { path: 'sales',  component: SalesResultComponent, pathMatch: 'full' },
  { path: 'dailyreport',  component: DailyReportComponent , pathMatch: 'full' },
  { path: 'message',  component: MessageComponent , pathMatch: 'full' },
  { path: 'reward',  component: RewardCompetionComponent , pathMatch: 'full' },
  { path: 'placement',  component: PlacementComponent , pathMatch: 'full' },
  { path: 'register',  component: RegistrationComponent , pathMatch: 'full' },
  { path: 'login',  component: LoginComponent , pathMatch: 'full' },

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
