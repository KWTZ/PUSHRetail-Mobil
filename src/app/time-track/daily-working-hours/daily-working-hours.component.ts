import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-daily-working-hours',
  templateUrl: './daily-working-hours.component.html',
  styleUrls: ['./daily-working-hours.component.css']
})
export class DailyWorkingHoursComponent implements OnInit {

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

  currentStatus=null;
  clockInDay;
  clockOutDay;

  workTime=[];
  workBreaks=[];

  currentAssignment:any=[];

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
    let now = new Date();
    let currentTime =now.toLocaleString('de-DE').substring(11,16);
    switch (status) {
      case 'clockInDay':
        this.workBegin =currentTime;
        this.clockInDay=currentTime;
        this.workTime.push({ clockInDay: currentTime, clockOutDay: null});
        break; 
      case 'clockOutDay':
        this.workEnd = currentTime;
        this.clockOutDay=currentTime;
        let wt = this.workTime[this.workTime.length-1];
        wt.clockOutDay=currentTime;
        break;
        
      case 'clockInBreak':
          this.workEnd = currentTime;
          this.workBreaks.push({ breakIn: currentTime, breakOut: null, breakhours: null});
          break;
      case 'clockOutBreak':
        this.workEnd = currentTime;
        let wb = this.workBreaks[this.workBreaks.length-1];
        wb.breakOut=currentTime;
        break;

    }

    console.log("dailyWork", this.workTime, (new Date('2024-01-01 23:00:00').getTime()- new Date('2024-01-01').getTime())/1000/60/60);
    console.log("breaks", this.workBreaks);
  }

}

const weekdays = [ 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ];

