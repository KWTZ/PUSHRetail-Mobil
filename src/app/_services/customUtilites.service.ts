import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})

export class CustomUtilityService {
     convertToSQLDate(dt) {
          let arrDate = dt.split(".");
          return arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
     }

     convertToNumberDOT(value) {
          let v = value.replace(".", "");
          return v.replace(",", ".");
     }
}