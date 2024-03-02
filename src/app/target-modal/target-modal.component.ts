import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-target-modal',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.css']
})
export class TargetModalComponent implements OnInit {

  constructor( private router: Router) { }


  ngOnInit(): void {
  }

  close() {
      this.router.navigate(['/', 'dailywork']);
  }

}
