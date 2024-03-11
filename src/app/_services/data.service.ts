import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getHeader(table: string) {
    // console.log("header" , table);
    //console.log(environment.apiPath +  '/header?table=' + table);
    return this.http.get<any>(environment.apiPath + '/header.php?table=' + table);
  }

  getAll(table: string) {
    console.log("getAll" , table);
    //console.log(environment.apiPath + '/list?table=' + table);
    return this.http.get<any>(environment.apiPath + '/list.php?table=' + table);
  }

  storeData(sqlStatement) {
    return this.http.post(environment.apiPath + '/store.php', { data: sqlStatement }).pipe(res=> {
      return res;  });
  }
}

