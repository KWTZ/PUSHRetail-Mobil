import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {

  sqlInsertReport = "INSERT INTO pos_reports(promoterNo, internalPOSNo, reportDate, frequency, leads, talks, testerQty, revenue, display, nameTag, tester, asm, img, comment, modified, modifiedBy, created, createdBy) VALUES "
  isValid = false;
  rep=Report;

  promoterNo;
  currentAssign;
  dataStored=false;

  constructor(private http:HttpClient,
    private dataService: DataService) { }

  ngOnInit(): void {
    let promoter = JSON.parse(localStorage.getItem("promoter"));
    this.promoterNo=promoter['promoterNo']
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
  }

  selectedImg;

  uploadFile(event:any){
    const file:File = event.target.files[0];
    this.selectedImg = file;
    this.rep.img = file;
    console.log('file',this.selectedImg);
    this.isValid=true;
  }

  storeImg(){
    console.log('file',this.selectedImg.name);
    const formData = new FormData();
    formData.append("file", this.selectedImg);
    this.http
    .post(environment.apiPath + "/movefile.php",formData)
    .subscribe(
      (res:any)=> { });
  }

  onChange(e, field) {
    console.log(field);
    this.rep[field]=e.target.value;
    console.log(this.rep);
  }

  doSave() {
    this.storeImg();
    this.sqlInsertReport+='("' + this.promoterNo + '", ' +  this.currentAssign['internalPOSNo'] + ', CURDATE(), ' + this.rep.valFrequency + ', ' + this.rep.valLeads + ', ' + this.rep.valTalks +
      ', ' + this.rep.valTester + ', ' + this.rep.revenue + ', "' + this.rep.display + '", "' + this.rep.nameTag + '", "' + this.rep.tester + '", "' + this.rep.asm + '", "' + this.selectedImg.name + '", ' +
      '"' + this.rep.comment + '", '+
      'CURRENT_TIMESTAMP, ' + this.promoterNo + ', CURRENT_TIMESTAMP, ' + this.promoterNo + ')';
    this.dataService.storeData(this.sqlInsertReport).subscribe(res => { console.log(res) });
    this.dataStored=true;
    this.isValid=false;
  }
}

const Report = {
  valFrequency:null,
  valLeads: null,
  valTalks: null,
  valTester: null,
  revenue: null,
  display: null,
  nameTag: null, 
  tester:null, 
  asm: null,
  img: null,
  comment: null



}
