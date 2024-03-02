import { Component,  OnInit} from '@angular/core';



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
    localStorage.setItem('promoterNo', '9999');
  }



}
