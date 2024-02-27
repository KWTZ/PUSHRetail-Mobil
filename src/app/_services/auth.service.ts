import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptService } from './encrypt.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient,
    private encrpt: EncryptService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(environment.apiPath + '/signin', { user : username, pw: this.encrpt.encryptAES256(password) }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    // return this.http.post(environment.apiPath + '/signup', { user: username, email:email, pw: password  },httpOptions);
    return this.http.post(environment.apiPath + '/signup', { user: username, email:email, pw: this.encrpt.encryptAES256(password)  },httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(environment.apiPath + '/signout', { }, httpOptions);
  }
}