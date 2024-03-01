import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { EncryptService } from 'src/app/_services/encrypt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form: any = {
    username: null,
    password: null
  };
  
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
    private encrypt: EncryptService, 
    private router: Router) { }

  ngOnInit(): void {
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getUser().roles;
    // }
  }

  onSubmit(): void {
     const { username, password } = this.form;

    console.log("test");
    this.authService.login(username, this.encrypt.encryptAES256(password)).subscribe(
      data => {
        console.log(data);
        if (data[0]['promoterNo']!=null) {
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          setTimeout(() =>  { this.router.navigate(['/', 'dailywork']); }, 2000);
        }
        else {
            this.isLoggedIn=false;
            this.isLoginFailed=true;
        }
       
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );

     // this.tokenStorage.saveToken(data.accessToken);
        // this.tokenStorage.saveUser(data[0]);

        // this.isLoginFailed = false;
        // this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().role;
        // this.reloadPage();
  }

  reloadPage(): void {
    window.location.reload();
  }
}