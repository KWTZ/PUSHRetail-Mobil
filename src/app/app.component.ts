import { Component,  OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit  {
  title = 'Push!retail - Mobil';
  
  
  elem: any; isFullScreen: boolean;

  constructor() {}


  ngOnInit(): void {
    if (environment.testing) {
      localStorage.setItem("isLoggedIn", 'true');
      localStorage.setItem("promoter", JSON.stringify( { username: 'Max Mustermann', promoterNo: '0057'} ));
      localStorage.setItem("assignment", JSON.stringify({internalPOSNo: '3709'}));
    }
    else {
      localStorage.setItem("isLoggedIn", 'false');
    }
    
  }



}
