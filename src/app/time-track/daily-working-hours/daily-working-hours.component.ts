import { Component, OnInit } from '@angular/core';
import { CustomUtilityService } from '../../_services/customUtilites.service';
import { DataService } from '../../_services/data.service';

@Component({
  selector: 'app-daily-working-hours',
  templateUrl: './daily-working-hours.component.html',
  styleUrls: ['./daily-working-hours.component.css']
})
export class DailyWorkingHoursComponent implements OnInit {

  sqlStringAssign: string = 'Select  a.idAssignment, a.internalPOSNo ' +
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
  sqlStringReports: string= 'select idReport from pos_reports where promoterNo="@promoterNo" and reportDate="@workingDay"';

  sqlWorkingDayInsert: string = "INSERT INTO pro_workingdays(promoterNo, workingday, begin, end, workinghours, modifiedBy, modified, createdBy, created) VALUES ";
  sqlWorkingDayUpdate: string = 'UPDATE pro_workingdays set end ="@workingEnd", workinghours="@workinghours"  where promoterNo="@promoterNo" and workingDay="@workingDay"';

  sqlBreakInsert: string = "INSERT INTO pro_workingbreaks(promoterNo, workingday, begin, end, duration, modifiedBy, modified, createdBy, created) VALUES";
  sqlBreakUpdate: string = 'UPDATE pro_workingbreaks set end="@breakEnd", duration="@duration"  where promoterNo="@promoterNo" and workingDay="@workingDay" and end IS NULL';

  assignNo=0;  
  noOfAssignment=0;
  weekdayName:string;   
  
  workBegin;
  workEnd;
  breakBegin;
  breakEnd;

  currentStatus='start';
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

  flagInDay=false;
  flagOutDay=false;
  flagInBreak=false;
  flagOutBreak=true;
  flagFinishBreak=false;
  flagEndDay=false;
  flagReport=false;
  isBreak=false;

  isFinish=false;

  constructor(private dataservice: DataService,
    private cutil: CustomUtilityService ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() { 
      let sqlStatement = this.sqlStringAssign;
      let promoter = JSON.parse(localStorage.getItem("promoter"));
      this.promoterNo=promoter['promoterNo']
      sqlStatement+=this.promoterNo + '"';
  
      this.dataservice.getAll(sqlStatement).subscribe( data => {
        this.listAssignments=data;
        this.noOfAssignment=data.length;
        this.getcurrentAssignment();

        this.currentAssignment=data[this.assignNo];
        localStorage.setItem("assignment", JSON.stringify(this.currentAssignment));
        console.log(this.currentAssignment)
        this.weekdayName=weekdays[this.currentAssignment['weekdayNo']];       

        this.getWorkingHours();
    });
  }

  getWorkingHours() {
    // working Day
    this.clockInDay=null;
    this.clockOutDay=null;
    let sqlString = this.sqlStringWorkingDay.replace('@promoterNo', this.promoterNo).replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
    let workingDay;
    let currentBreak;
    let sumBreak=0;
    let sumWorkinghours=0;

    // WorkingDay
    this.dataservice.getAll(sqlString).subscribe( async data => { 
      if (data.length==1) {
        workingDay = data[0];
        this.clockInDay = workingDay['begin'];
        this.clockOutDay= workingDay['end'];

      
        this.workTime.push({ clockInDay: workingDay['begin'], clockOutDay: workingDay['end'], workingHours: workingDay['workingHours']});
        this.currentStatus="clockInDay";
        if (this.clockOutDay>'')
            this.currentStatus="clockOutDay";

            this.workTime.forEach(item => {
              sumWorkinghours+=item['workingHours'];
            });
          }
          else {
            this.clockInDay=null;
            this.clockOutDay=null;
            this.currentStatus="start";
          }


          // reports
          let idReport; 
          let sqlReport = this.sqlStringReports.replace("@promoterNo", this.promoterNo);  
          sqlReport = sqlReport.replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
          this.dataservice.getAll(sqlReport).subscribe(repData => { 
            if (repData.length>0) {
              idReport = repData[0]['idReport']; 
              if(idReport!=undefined) {
                this.currentStatus="clockOutDay";
              }
            }         

              // breaks
              let sqlStatement = this.sqlStringBreaks.replace('@promoterNo', this.promoterNo).replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
              this.dataservice.getAll(sqlStatement).subscribe(data => {  this.workBreaks=data; 

            if(data.length>0) {
              if (data.lengt==0) {
                this.lastBreak=data[0];
              }
              else {
                this.lastBreak = data[data.length-1];
              }
              if (this.lastBreak['breakOut']==null) {
                this.breakBegin=this.lastBreak['breakIn'];
                this.currentStatus="clockInBreak";
              }   
              else {

            
              }     
            }


            this.workBreaks.forEach(item => {
              sumBreak += item['breakDuration'];
              item['breakDuration']=this.formatTime(item['breakDuration']);
            
            });

            this.totalbreaks=this.formatTime(sumBreak);
            this.totalWorkingMonth=this.formatTime(sumWorkinghours-sumBreak);
          
            this.setStatus(this.currentStatus);
          });
        });  
    });

    
    this.totalWorkingDay=this.formatTime(sumWorkinghours-sumBreak);
    this.setStatus(this.currentStatus);

  }

  getcurrentAssignment() {
      let today = new Date().toLocaleDateString("de-DE", {year: 'numeric', month: '2-digit', day: '2-digit'});
      
      this.listAssignments.forEach((element, index) => {
          if (element.operationDate == today) {
            this.assignNo=index;
          }
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

    localStorage.setItem("assignment", JSON.stringify(this.currentAssignment));

    this.getWorkingHours();
  }

  setStatus(status: string) {
    console.log("status", status);
    let now = new Date();
    let currentTime =now.toLocaleString('de-DE').substring(11,16);
    switch(status) {
      case 'start':
        if(this.clockInDay==undefined) {
          this.flagInDay=false;
          this.flagEndDay=false;
          this.flagInBreak=false;
          this.flagOutBreak=true;
          this.flagReport=false;
        }
        break;

      case 'clockInDay':
        if (this.clockInDay==undefined) {
          this.flagInDay=true;
          this.flagInBreak=false;
          this.flagOutBreak=true;
          this.flagEndDay=false;
          this.flagReport=false;
        }
        else {
          this.workBegin=null;
          this.flagInDay=true;
          this.flagInBreak=true;
          this.flagOutBreak=false;
          this.flagFinishBreak=false;
          this.flagEndDay=false;
          this.flagReport=true;
          this.isBreak=false;
        }
        break;

      case 'clockOutDay':
        if(this.clockOutDay==undefined) {
          this.flagEndDay=true;
          this.isFinish=false;
        }
        else {
          this.flagEndDay=false;
          this.isFinish=true;
        }

        this.workBegin=null;
        this.flagInDay=true;

        this.flagInBreak=false;
        this.flagOutBreak=true;
        this.flagReport=false;
        break;


      case 'clockInBreak':
        if(this.breakBegin==undefined ) {
          this.breakBegin=currentTime;
          this.flagInBreak=false;
          this.flagOutBreak=true;
          this.flagEndDay=false;
          this.flagReport=false;
          this.isBreak=true;


        }
        else {
          this.flagInDay=true;
          this.flagOutDay=true;
          this.flagInBreak=false;
          this.flagOutBreak=false;
          this.flagFinishBreak=true;
          this.flagEndDay=false;
          this.flagReport=false;
          this.isBreak=true;
          this.breakEnd=null;
  
        }
        this.workBegin=null;
        break;

      case 'clockOutBreak':
        this.breakEnd=currentTime;
        this.workBegin=null;
        break;

    }

    // Operation Date in future
    if(new Date(this.cutil.convertToSQLDate(this.currentAssignment['operationDate']))>new Date()) {
      this.flagInDay=true;
      this.flagOutDay=false;
    }
  }  

  saveWorkinghours(flag) {
    let sqlStatement;
    if (flag=='start') {
        sqlStatement = this.sqlWorkingDayInsert+'("' + this.promoterNo + '", "' + this.cutil.convertToSQLDate(this.currentAssignment['operationDate']) + '", "' + this.workBegin + '", null, 0, "' + this.promoterNo + '", CURRENT_TIME, "' + this.promoterNo + '", CURRENT_TIME)';
        this.clockInDay=this.workBegin;
        this.flagInBreak=true;
        this.flagReport=true;

    }

    if (flag=="end") {
        sqlStatement = this.sqlWorkingDayUpdate;
        sqlStatement = sqlStatement.replace('@promoterNo', this.promoterNo);
        sqlStatement = sqlStatement.replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
        sqlStatement = sqlStatement.replace('@workingEnd', this.workEnd);
        sqlStatement = sqlStatement.replace('@workinghours', this.calcTimeDifference(this.clockInDay, this.workEnd));
        this.workEnd=null;
    }


    
    console.log(sqlStatement);
    this.dataservice.storeData(sqlStatement).subscribe(res => { console.log(res); });
    this.getData()

  }

  saveBreak(flag) {
      let sqlStatement;
      if (flag == 'start') {
        sqlStatement = this.sqlBreakInsert+'("' + this.promoterNo + '", "' + this.cutil.convertToSQLDate(this.currentAssignment['operationDate']) + '", "' + this.breakBegin + '", null, null, "' + this.promoterNo + '", CURRENT_TIME, "' + this.promoterNo + '", CURRENT_TIME)';
        this.currentStatus="clockInBreak";
        this.workBegin=null;
       
      }

      if (flag=='end') {
        sqlStatement = this.sqlBreakUpdate;
        sqlStatement = sqlStatement.replace('@promoterNo', this.promoterNo);
        sqlStatement = sqlStatement.replace('@workingDay', this.cutil.convertToSQLDate(this.currentAssignment['operationDate']));
        sqlStatement = sqlStatement.replace('@breakEnd', this.breakEnd);
        sqlStatement = sqlStatement.replace('@duration', this.calcTimeDifference(this.lastBreak['breakIn'], this.breakEnd));
       
      }

      console.log(sqlStatement);
      this.breakBegin=null;

      this.dataservice.storeData(sqlStatement).subscribe(res => { console.log(res); });
      this.getData();
  
  }

  setDayStart() {
    let now = new Date();
    let currentTime =now.toLocaleString('de-DE').substring(11,16);
    this.workBegin=currentTime;
    this.setStatus('clockInDay');
  }
  setDayEnd() {
    let now = new Date();
    let currentTime =now.toLocaleString('de-DE').substring(11,16);
    this.workEnd=currentTime;
    this.setStatus('cloclOutDay');
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

      // console.log(`${("00" + totalHours).slice(-2)}:${("00"+remMinutes).slice(-2)}`);
      // console.log(`${totalHours}:${remMinutes}:${remSeconds}`);

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

