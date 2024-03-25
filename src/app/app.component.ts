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
      localStorage.setItem("promoter", JSON.stringify({ 
            "0": "0057",
            "1": "Max Mustermann",
            "2": "MMUSS",
            "3": "m.mustermann@nixda.de",
            "promoterNo": "0057",
            "username": "Max Mustermann",
            "initial": "MMUSS",
            "email": "m.mustermann@nixda.de" 
      }));
      localStorage.setItem("assignment", JSON.stringify({
        "idAssignment": 1685,
        "internalPOSNo": "3709",
        "externalPOSNo": "",
        "posName": "Müller",
        "posStreet": "Rathausallee 16",
        "postalcode": "53757",
        "city": "St. Augustin",
        "operationDate": "15.03.2024",
        "weekdayNo": 4,
        "begin": "11:00",
        "end": "19:00"
    }));
    }
    else {
      localStorage.setItem("isLoggedIn", 'false');
    }
    
  }



}
