import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/_services/data.service';
import { CustomUtilityService } from 'src/app/_services/customUtilites.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {
  @ViewChild('salesModal') salesModal : TemplateRef<any>; // Note: TemplateRef

  sqlInsertReport = "INSERT INTO pos_reports(promoterNo, internalPOSNo, reportDate, frequency, leads, talks, testerQty, revenue, display, nameTag, tester, asm, img " +
   " , customerReaction, requestedChanges,  modified, modifiedBy, created, createdBy) VALUES ";

  sqlSales = 'SELECT idSales FROM prd_sales WHERE promoterNo="@promoterNo" and salesdate="@salesdate"';
  isValid = false;
  rep=Report;

  promoterNo;
  currentAssign;
  dataStored=false;

  selectedImg;
  filename;
  submitted=false;
  reportDay;
  showModal=false;

  constructor(private http:HttpClient,
    private dataService: DataService,
    private util:CustomUtilityService,
    private modalService: NgbModal,
    private router: Router) { }
    

  ngOnInit(): void {
    let promoter = JSON.parse(localStorage.getItem("promoter"));
    this.promoterNo=promoter['promoterNo']
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
    this.reportDay=this.currentAssign['operationDate'];
    if (this.reportDay==undefined)
      this.reportDay="07.03.2024";
  }



  uploadFile(event:any){
    const file:File = event.target.files[0];
    this.selectedImg = file;
    this.rep.img = file;
    console.log('file',this.selectedImg);
    this.filename= this.selectedImg.name;
    this.checkIsValid();
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
    this.checkIsValid();
  }

  checkIsValid() {
    if(this.rep.valFrequency==null) 
    this.isValid=false;
  else if(this.rep.valLeads==null)
    this.isValid=false;
  else if(this.rep.valTalks==null)
    this.isValid=false;
  else if(this.rep.valTester==null)
    this.isValid=false;
  else if(this.rep.revenue==null)
    this.isValid=false;
  else if(this.rep.display==null)
    this.isValid=false;
  else if(this.rep.nameTag==null)
    this.isValid=false;
  else if(this.rep.tester==null)
    this.isValid=false;
  else if(this.rep.asm==null)
    this.isValid=false;
  else
    this.isValid=true;
  }

  doSave() {
    let sqlStatement = this.sqlSales.replace("@promoterNo", this.promoterNo);
    sqlStatement = sqlStatement.replace("@salesdate", this.util.convertToSQLDate(this.reportDay));

    this.dataService.getAll(sqlStatement).subscribe(data => {
        if (data.length== 0) {
          this.modalService.open(this.salesModal);
        }
        else {

          // save data
          this.storeImg();
          this.sqlInsertReport+='("' + this.promoterNo + '", ' +  this.currentAssign['internalPOSNo'] + ', "' + this.util.convertToSQLDate(this.reportDay) + '", ' + this.rep.valFrequency + ', ' + this.rep.valLeads + ', ' + this.rep.valTalks +
            ', ' + this.rep.valTester + ', ' + this.rep.revenue + ', "' + this.rep.display + '", "' + this.rep.nameTag + '", "' + this.rep.tester + '", "' + this.rep.asm + '", "' + this.selectedImg.name + '", ' +
            '"' + this.rep.custReaction + '", "' + this.rep.requestChanges + '", ' +
            'CURRENT_TIMESTAMP, ' + this.promoterNo + ', CURRENT_TIMESTAMP, ' + this.promoterNo + ')';
          this.dataService.storeData(this.sqlInsertReport).subscribe(res => { console.log(res) });
          this.dataStored=true;
          this.isValid=false;
        }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.router.navigate(['/', 'sales']);

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
  custReaction: null,
  requestChanges: null
}
