import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  isLoggedIn='false';
  userName;

  constructor() { }

  ngOnInit(): void {
      this.isLoggedIn=localStorage.getItem("isLoggedIn");
      let user =JSON.parse(localStorage.getItem("promoter"));
      this.userName = user['username'];

  }

  setStorage() {
    localStorage.clear();
  }

}
