import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TopnavComponent } from './_nav/topnav/topnav.component';


import { LoginComponent } from './login/login/login.component';
import { PlacementComponent } from './placement/placement.component';
import { DailyReportComponent } from './report/daily-report/daily-report.component';
import { SalesResultComponent } from './sales/sales-result/sales-result.component';
import { DailyWorkingHoursComponent } from './time-track/daily-working-hours/daily-working-hours.component';
import { MessageComponent } from './communication/message/message.component';
import { IntroComponent } from './intro/intro.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlacementComponent,
    DailyReportComponent,
    SalesResultComponent,
    DailyWorkingHoursComponent,
    MessageComponent,
    TopnavComponent,
    IntroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
