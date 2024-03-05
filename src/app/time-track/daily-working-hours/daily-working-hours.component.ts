import { Component, OnInit } from '@angular/core';
import { CustomUtilityService } from '../../_services/customUtilites.service';
import { DataService } from '../../_services/data.service';

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
                        ' where promoterNo="';

  sqlStringWorkingDay: string = 'SELECT workingDay, begin, end, workingHours FROM pro_workingdays where promoterNo="@promoterNo" and workingDay="@workingDay"';
  sqlStringBreaks: string = 'SELECT begin as breakIn, end as breakOut, duration as breakDuration FROM pro_workingbreaks where promoterNo="@promoterNo" and workingDay="@workingDay"'; 

  sqlWorkingDayInsert: string = "INSERT INTO pro_workingdays(promoterNo, workingday, begin, end, workinghours, modifiedBy, modified, createdBy, created) VALUES ";
  sqlWorkingDayUpdate: string = 'UPDATE pro_workingdays set end ="@workingEnd", workinghours="@workinghours"  where promoterNo="@promoterNo" and workingDay=CURDATE() ';

  sqlBreakInsert: string = "INSERT INTO pro_workingbreaks(promoterNo, workingday, begin, end, duration, modifiedBy, modified, createdBy, created) VALUES";
  sqlBreakUpdate: string = 'UPDATE pro_workingbreaks set end="@breakEnd", duration="@duration"  where promoterNo="@promoterNo" and workingDay=CURDATE() and end IS NULL';

  assignNo=0;  
  noOfAssignment=0;
  weekdayName:string;   
  
  workBegin;
  workEnd;

  currentStatus=null;
  clockInDay;
  clockOutDay;
  totalWorkingDay;
  totalWorkingMonth;

  workTime=[];
  workBreaks=[];
  lastBreak;
  totalbreaks="";
  totalbreaksMilliDiff=0;

  currentAssignment:any=[];

  listAssignments;
  promoterNo;

  constructor(private dataservice: DataService,
    private cutil: CustomUtilityService ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() { 
      let promoter = JSON.parse(localStorage.getItem("promoter"));
      this.promoterNo=promoter['promoterNo']
      this.sqlString+=this.promoterNo + '"';
      console.log(this.sqlString);
      this.dataservice.getAll(this.sqlString).subscribe( data => {
        console.log(data);
        // this.listAssignemnts=data;
        this.listAssignments=data;
        this.noOfAssignment=data.length;
        this.currentAssignment=data[this.assignNo];
        console.log(this.currentAssignment)
        this.weekdayName=weekdays[this.currentAssignment['weekdayNo']];

        this.getWorkingHours();
    });
  }

  getWorkingHours() {

    // working Day
    let sqlString = this.sqlStringWorkingDay.replace('@promoterNo', this.promoterNo).replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
    let workingDay;
    let sumBreak=0;
    let sumWorkinghours=0;

    this.dataservice.getAll(sqlString).subscribe( data => { 
      if (data.length==1) {
        workingDay = data[0];
        this.clockInDay = workingDay['begin'];
        this.clockOutDay= workingDay['end'];
      
        this.workTime.push({ clockInDay: workingDay['begin'], clockOutDay: workingDay['end'], workingHours: workingDay['workingHours']});
        this.currentStatus="clockInDay";

        this.workTime.forEach(item => {
          sumWorkinghours+=item['workingHours'];
        });
      }
      else {
        this.clockInDay=null;
        this.clockOutDay=null;
      }
    });


   
   

    // breaks
    let sqlStatement = this.sqlStringBreaks.replace('@promoterNo', this.promoterNo).replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
    this.dataservice.getAll(sqlStatement).subscribe(data => {  this.workBreaks=data; 

      if(data.length>0) {
        this.lastBreak = data[data.length-1];
        if (this.lastBreak['breakOut']==null) {
          this.currentStatus="clockInBreak";
        }   
        else {
          this.currentStatus="clockInDay";
        }     
      }


      this.workBreaks.forEach(item => {
        sumBreak += item['breakDuration'];
        item['breakDuration']=this.formatTime(item['breakDuration']);
      });

      this.totalbreaks=this.formatTime(sumBreak);

      this.totalWorkingDay=this.formatTime(sumWorkinghours-sumBreak);
      this.totalWorkingMonth=this.formatTime(sumWorkinghours-sumBreak);
     
    });
    

  }

  setAssign(pos: number) {
    this.assignNo+=pos;
    if (this.assignNo<0)
      this.assignNo=0;

    if (this.assignNo>=this.noOfAssignment)
      this.assignNo=this.noOfAssignment-1;

    this.currentAssignment=this.listAssignments[this.assignNo]
    this.weekdayName=weekdays[this.currentAssignment['weekdayNo']];

    this.getWorkingHours();
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
        wt.workingHours=this.formatTime(this.calcTimeDifference(wt.clockInDay, wt.clockOutDay));
        break;
        
      case 'clockInBreak':
          this.workBegin = currentTime;
          this.workEnd=null;
          this.workBreaks.push({ breakIn: currentTime, breakOut: null, breakDuration: null});
          
          break;
      case 'clockOutBreak':
        this.workEnd = currentTime;
        let wb = this.workBreaks[this.workBreaks.length-1];
        wb.breakOut=currentTime;
        wb.breakDuration=this.formatTime(this.calcTimeDifference(wb.breakIn, wb.breakOut));
        break;

    }

    console.log("breaks", this.workBreaks);
  }

  saveWorkinghours() {
    let sqlStatement;
    switch(this.currentStatus) {
      case 'clockInDay':
        sqlStatement = this.sqlWorkingDayInsert+'("' + this.promoterNo + '", CURDATE(), "' + this.clockInDay + '", null, 0, "' + this.promoterNo + '", NOW(), "' + this.promoterNo + '", NOW())';
        break;
      case 'clockOutDay':
        sqlStatement = this.sqlWorkingDayUpdate;
        sqlStatement = sqlStatement.replace('@promoterNo', this.promoterNo);
        sqlStatement = sqlStatement.replace('@workingEnd', this.clockOutDay);
        sqlStatement = sqlStatement.replace('@workinghours', this.calcTimeDifference(this.clockInDay, this.clockOutDay));
        break;
      case 'clockInBreak':
        sqlStatement = this.sqlBreakInsert+'("' + this.promoterNo + '", CURDATE(), "' + this.workBegin + '", null, null, "' + this.promoterNo + '", NOW(), "' + this.promoterNo + '", NOW())';
        this.currentStatus="clockInBreak";
        break;
      case 'clockOutBreak':
        sqlStatement = this.sqlBreakUpdate;
        sqlStatement = sqlStatement.replace('@promoterNo', this.promoterNo);
        sqlStatement = sqlStatement.replace('@breakEnd', this.workEnd);
        sqlStatement = sqlStatement.replace('@duration', this.calcTimeDifference(this.lastBreak['breakIn'], this.workEnd))
        break;
    }

    console.log(sqlStatement);
    this.dataservice.storeData(sqlStatement).subscribe(res => { console.log(res); });

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
    return milliDiff;

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


// const Assignments = [
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "07.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "14.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "21.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "27.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "28.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3},
//   {begin: "11:00", city: "Frankfurt", end: "19:00", externalPOSNo: "", idAssignment: 169, internalPOSNo: "109", operationDate: "30.03.2024", posName: "Douglas", posStreet: "Zeil 98-102", postalcode: "60313", weekdayNo: 3}
// ]

