import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css']
})
export class DailyReportComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  selctedImg;

  uploadFile(event:any){
    const file:File = event.target.files[0];
    this.selctedImg = file;
    console.log('file',this.selctedImg);
  }

  storeImg(){
    console.log('file',this.selctedImg.name);
    const formData = new FormData();
    formData.append("file", this.selctedImg);
    this.http
    .post("https://api.ddev.site/movefile.php",formData)
    .subscribe(
      (res:any)=> { });
  }

}
