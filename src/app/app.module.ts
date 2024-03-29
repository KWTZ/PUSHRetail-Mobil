import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { TopnavComponent } from './_nav/topnav/topnav.component';


import { LoginComponent } from './login/login/login.component';
import { PlacementComponent } from './placement/placement.component';
import { DailyReportComponent } from './report/daily-report/daily-report.component';
import { SalesResultComponent } from './sales/sales-result/sales-result.component';
import { DailyWorkingHoursComponent } from './time-track/daily-working-hours/daily-working-hours.component';
import { MessageComponent } from './communication/message/message.component';
import { IntroComponent } from './intro/intro.component';
import { HomeComponent } from './home/home.component';
import { RewardCompetionComponent } from './reward-competion/reward-competion.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { FooterComponent } from './_nav/footer/footer.component';
import { OutofstockComponent } from './outofstock/outofstock.component';
import { TargetModalComponent } from './target-modal/target-modal.component';
import { AuthGuardService } from './_services/auth.guard';
import { TestpwComponent } from './login/testpw/testpw.component';




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
    IntroComponent,
    HomeComponent,
    RewardCompetionComponent,
    RegistrationComponent,
    FooterComponent,
    OutofstockComponent,
    TargetModalComponent,
    TestpwComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule


  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
