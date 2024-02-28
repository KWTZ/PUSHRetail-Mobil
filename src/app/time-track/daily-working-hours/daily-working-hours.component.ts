import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-daily-working-hours',
  templateUrl: './daily-working-hours.component.html',
  styleUrls: ['./daily-working-hours.component.css']
})
export class DailyWorkingHoursComponent implements OnInit {

  // sqlString: string = 'SELECT @i:=@i+1 AS rowNo, ' +
  //                       ' t.idAssignment, t.internalPOSNo ' +
  //                       ', DATE_FORMAT(t.operationDate, "%d.%m.%Y") as operationDate ' +
  //                       ', weekday(t.operationDate)+1 as weekday ' +
  //                       ', Date_Format(t.begin, "%H:%m") as begin ' +
  //                       ', Date_Format(t.end, "%H:%m") as end  ' +
  //                       '  , t.posname, t.posStreet, t.postalcode, t.city ' +
  //                       'FROM ' +
  //                       '  (Select a.*,  p.externalPOSNo, p.posName, p.posStreet, p.postalcode, p.city from pos_assignments a ' +
  //                       '  inner join pos_pointofsales p on a.internalPOSNo=p.internalPOSNo) AS t, ' +
  //                       '  (SELECT @i:=0) AS foo ' +
  //                       'where t.promoterNo="' + localStorage.getItem('promoterNo') + '"';

  sqlString: string = 'Select  a.idAssignment, a.internalPOSNo ' +
                        ' , p.externalPOSNo, p.posName, p.posStreet, p.postalcode, p.city ' +
                        ', DATE_FORMAT(a.operationDate, "%d.%m.%Y") as operationDate ' +
                        ', weekday(a.operationDate) as weekdayNo ' +
                        ', Date_Format(a.begin, "%H:%m") as begin ' +
                        ', Date_Format(a.end, "%H:%m") as end  ' +
                        ' from pos_assignments a ' +
                        '  inner join pos_pointofsales p on a.internalPOSNo=p.internalPOSNo ' +
                        ' where promoterNo="' + localStorage.getItem('promoterNo') + '"';

  assignNo=0;  
  noOfAssignment=0;
  weekdayName:string;   
  
  workBegin;
  workEnd;

  currentAssignment:any=[];
  currentStatus='end';
  listAssignemnts;
  promoterNo;

  constructor(private dataservice: DataService ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() { 
      this.dataservice.getAll(this.sqlString).subscribe( data => {
        this.listAssignemnts=data;
        this.noOfAssignment=data.length;
        this.currentAssignment=data[this.assignNo];
        console.log(this.currentAssignment)
        this.weekdayName=weekdays[this.currentAssignment['weekdayNo']]
    });
  }

  setAssign(pos: number) {
    this.assignNo+=pos;
    if (this.assignNo<0)
      this.assignNo=0;

    if (this.assignNo>=this.noOfAssignment)
      this.assignNo=this.noOfAssignment-1;

    this.currentAssignment=this.listAssignemnts[this.assignNo]
    this.weekdayName=weekdays[this.currentAssignment['weekdayNo']]
  }

  setStatus(status: string) {
    this.currentStatus=status;
    if (status=='working') {
      let now = new Date();
      this.workBegin = now.toLocaleString('de-DE').substring(11,16);
    }
  }

}

export interface Assignment {
  idAssignment: number,
  internalPosNo: string,
  externalPosNo: string,
  operationDate: string
}
const weekdays = [ 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ];

