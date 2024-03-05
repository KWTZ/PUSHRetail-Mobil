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
  totalbreaks="";
  totalbreaksMilliDiff=0;

  currentAssignment:any=[];

  listAssignments;
  promoterNo;

  constructor(private dataservice: DataService ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() { 
    //   this.dataservice.getAll(this.sqlString).subscribe( data => {
    //     console.log(data);
    //     // this.listAssignemnts=data;
    //     this.listAssignemnts=Assignments;
    //     this.noOfAssignment=data.length;
    //     this.currentAssignment=data[this.assignNo];
    //     console.log(this.currentAssignment)
    //     this.weekdayName=weekdays[this.currentAssignment['weekdayNo']]
    // });

    this.listAssignments=Assignments;
    console.log("assignment.",  this.listAssignments);
    this.noOfAssignment=this.listAssignments.length;
    this.currentAssignment=this.listAssignments[this.assignNo];
    console.log(this.currentAssignment)
    this.weekdayName=weekdays[this.currentAssignment['weekdayNo']]
  }

  setAssign(pos: number) {
    this.assignNo+=pos;
    if (this.assignNo<0)
      this.assignNo=0;

    if (this.assignNo>=this.noOfAssignment)
      this.assignNo=this.noOfAssignment-1;

    this.currentAssignment=this.listAssignments[this.assignNo]
    this.weekdayName=weekdays[this.currentAssignment['weekdayNo']]
  }

  setStatus(status: string) {
    this.currentStatus=status;
    let now = new Date();
    let currentTime =now.toLocaleString('de-DE').substring(10,15);
    switch (status) {
      case 'clockInDay':
        this.workBegin =currentTime;
        this.clockInDay=currentTime;
        this.workTime.push({ clockInDay: currentTime, clockOutDay: null, workingHours: null});
        break; 
      case 'clockOutDay':
        this.workEnd = currentTime;
        this.clockOutDay=currentTime;
        let wt = this.workTime[this.workTime.length-1];
        wt.clockOutDay=currentTime;
        wt.workingHours=this.calcTimeDifference(wt.clockInDay, wt.clockOutDay);
        break;
        
      case 'clockInBreak':
          this.workBegin = currentTime;
          this.workBreaks.push({ breakIn: currentTime, breakOut: null, breakduration: null});
          break;
      case 'clockOutBreak':
        this.workEnd = currentTime;
        let wb = this.workBreaks[this.workBreaks.length-1];
        wb.breakOut=currentTime;
        wb.breakduration=this.calcTimeDifference(wb.breakIn, wb.breakOut);
        break;

    }

    console.log("dailyWork", this.workTime, (new Date('2024-01-01 23:00:00').getTime()- new Date('2024-01-01').getTime())/1000/60/60);
    console.log("breaks", this.workBreaks);
  }

  calcTimeDifference(beginn, ende) {
    var help = new Date();
    var arrStart = beginn.split(":");
    var arrEnd = ende.split(":");

    help.setHours(arrStart[0]);
    help.setMinutes(arrStart[1]);
    help.setSeconds(0);
    help.setMilliseconds(0);
    var start = help.getTime();
    
    help.setHours(arrEnd[0]);
    help.setMinutes(arrEnd[1]);
    var end = help.getTime()
    var milliDiff = end - start; // Differenz in Millisekunden
    this.totalbreaksMilliDiff+=milliDiff;

    this.totalbreaks=this.formatTime(this.totalbreaksMilliDiff);
    return this.formatTime(milliDiff);

  }

  formatTime(milliDiff) {
      // Total number of seconds in the difference
      const totalSeconds = Math.floor(milliDiff / 1000);
    
      // Total number of minutes in the difference
      const totalMinutes = Math.floor(totalSeconds / 60);
      
      // Total number of hours in the difference
      const totalHours = Math.floor(totalMinutes / 60);
      
      // Getting the number of seconds left in one minute
      const remSeconds = totalSeconds % 60;
      
      // Getting the number of minutes left in one hour
      const remMinutes = totalMinutes % 60;

      console.log(`${("00" + totalHours).slice(-2)}:${("00"+remMinutes).slice(-2)}`);
      console.log(`${totalHours}:${remMinutes}:${remSeconds}`);

      return `${("00" + totalHours).slice(-2)}:${("00"+remMinutes).slice(-2)}`
  }

}

const weekdays = [ 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ];

const Assignments = [
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "07.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "14.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "21.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "27.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "28.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
  {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "30.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3}
]

