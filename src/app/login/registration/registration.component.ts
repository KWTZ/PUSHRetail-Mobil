import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };

  repeatPassword;
  PWEqual=true;


  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor( private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.form.password!=this.repeatPassword) {
      this.isSuccessful=false;
      this.isSignUpFailed=true;
      this.PWEqual=false;
    }
    else {
        const { username, email, password } = this.form;
        console.log(username, email, password);
        this.authService.register(username, email, password).subscribe(
          data => {
            console.log(data);
            if (data[0]['result']!=null) {
              this.isSuccessful = true;
              this.isSignUpFailed = false;
              setTimeout(() =>  { this.router.navigate(['/', 'login']); }, 2000);
            }
            else {
                this.isSuccessful=false;
                this.isSignUpFailed=true;
            }
          },
          err => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
          }
        );
    }
  }
}