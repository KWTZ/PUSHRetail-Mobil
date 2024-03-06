import { Component,  OnInit, HostListener,  Inject} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { EncryptService } from 'src/app/_services/encrypt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common';
import { TargetModalComponent } from 'src/app/target-modal/target-modal.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //declare variable
  elem: any; isFullScreen: boolean;

  // sqlString: string = 'select idAssignment, idPosPlacement, internalPOSNo, operationDate from pos_assignments where promoterNo= "@promoterNo" and operationDate=CURDate()';
  sqlString: string = 'select idAssignment, idPosPlacement, internalPOSNo, operationDate from pos_assignments where promoterNo= "@promoterNo" and operationDate="2024-03-07"';

  form: any = {
    username: null,
    password: null
  };
  
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  
   promoterNo;

  constructor(
    private authService: AuthService,
    private router: Router,
    private encrypt: EncryptService,
    private modalService: NgbModal, 
    private dataService: DataService,
    @Inject(DOCUMENT) private document: any ) { }

    @HostListener('document:fullscreenchange', ['$event'])
    @HostListener('document:webkitfullscreenchange', ['$event'])
    @HostListener('document:mozfullscreenchange', ['$event'])
    @HostListener('document:MSFullscreenChange', ['$event'])


  ngOnInit(): void {
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getUser().roles;
    // }
  }

  

  onSubmit(): void {
     const { username, password } = this.form;

    console.log("test", username, password);
    this.authService.login(username, password).subscribe(
      data => {
        console.log(data);
        if (data[0]['promoterNo']!=null) {
          this.isLoggedIn = true;
          this.isLoginFailed = false;
          this.promoterNo = data[0]['promoterNo'];
          localStorage.setItem("promoter", JSON.stringify(data[0]));
          localStorage.setItem("isLoggedIn", 'true');
          this.getCurrentAssignment();
          this.openPopup();
          setTimeout(() =>  { this.router.navigate(['/', 'dailywork']); }, 1000);
        }
        else {
            this.isLoggedIn=false;
            this.isLoginFailed=true;
        }
       
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        localStorage.clear();
        localStorage.setItem("isLoggedIn", 'false');
        this.reloadPage();
      }
    );        
  }

  getCurrentAssignment() {
       let sqlStatement = this.sqlString.replace("@promoterNo", this.promoterNo);
       this.dataService.getAll(sqlStatement).subscribe( data => {
        localStorage.setItem("assignment", JSON.stringify(data[0]));
      })
  }

  openPopup() {
    const modalRef = this.modalService.open(TargetModalComponent);  
  }

  

  reloadPage(): void {
    window.location.reload();
  }

    /* fullscreen setting */
    openFullscreen() {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    }

}