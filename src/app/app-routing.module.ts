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
import { OutofstockComponent } from './outofstock/outofstock.component';
import { AuthGuardService } from './_services/auth.guard';


const routes: Routes = [
  { path: '',  component: IntroComponent, pathMatch: 'full' },
  { path: 'home',  component: HomeComponent, pathMatch: 'full', canActivate:[AuthGuardService] },
  { path: 'dailywork',  component: DailyWorkingHoursComponent, pathMatch: 'full', canActivate:[AuthGuardService] },
  { path: 'sales',  component: SalesResultComponent, pathMatch: 'full', canActivate:[AuthGuardService] },
  { path: 'outofstock',  component: OutofstockComponent, pathMatch: 'full', canActivate:[AuthGuardService] }, 
  { path: 'dailyreport',  component: DailyReportComponent , pathMatch: 'full', canActivate:[AuthGuardService]  },
  { path: 'message',  component: MessageComponent , pathMatch: 'full' , canActivate:[AuthGuardService] },
  { path: 'reward',  component: RewardCompetionComponent , pathMatch: 'full' , canActivate:[AuthGuardService] },
  { path: 'placement',  component: PlacementComponent , pathMatch: 'full' , canActivate:[AuthGuardService] },
  { path: 'register',  component: RegistrationComponent , pathMatch: 'full'  },
  { path: 'login',  component: LoginComponent , pathMatch: 'full'  },
  
    //Wild Card Route for 404 request 
    // { path: '**', pathMatch: 'full',  component: PagenotfoundComponent }, 
    // { path: '404', pathMatch: 'full',  component: PagenotfoundComponent }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
