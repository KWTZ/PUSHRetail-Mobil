import { Component, OnInit } from '@angular/core';
import { EncryptService } from 'src/app/_services/encrypt.service';

@Component({
  selector: 'app-testpw',
  templateUrl: './testpw.component.html',
  styleUrls: ['./testpw.component.css']
})
export class TestpwComponent implements OnInit {

  password;
  decryptPassword
  constructor(
    private encrypt: EncryptService
  ) { }

  ngOnInit(): void {
  }

  checkPassword() {
    this.decryptPassword=this.encrypt.decryptAES256(this.password);
  }

}
