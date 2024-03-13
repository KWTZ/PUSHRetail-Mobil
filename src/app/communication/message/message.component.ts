import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/_services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  sqlInsertMessage = 'INSERT INTO glb_messages(messageType, subject, message, callbackNo, modified, modifiedBy, created, createdBy) VALUES '

  isSend=false;
  hasSend=false;
  isEmergency=false;
  mes = Message;
  promoter;
  currentAssign;

  isValid=true;
  
  constructor(private dataService: DataService,private http:HttpClient) { }

  ngOnInit(): void {
    this.promoter=JSON.parse(localStorage.getItem('promoter'));
    this.currentAssign = JSON.parse(localStorage.getItem("assignment"));
  }

  sendMessage() {
        this.sqlInsertMessage+='("' + this.mes.messageType + '", "' + this.mes.subject + '", "' + this.mes.message + '", "' + this.mes.callbackNo + '", ' +
        'CURRENT_TIMESTAMP, ' + this.promoter['promoterNo'] + ', CURRENT_TIMESTAMP, ' + this.promoter['promoterNo'] + ')';
        console.log(this.sqlInsertMessage);

        this.dataService.storeData(this.sqlInsertMessage).subscribe(res => { console.log(res);
          this.hasSend=true;
          this.mes.messageType=null;
          this.mes.subject=null;
          this.mes.callbackNo=null;
          this.mes.message=null;
        });

        console.log('Message',this.mes);
        const formData = new FormData();
        formData.append("messageType", this.mes.messageType);
        formData.append("subject", this.mes.subject + ", " + this.promoter['username']  + " - POS: " + this.currentAssign['internalPOSNo']);
        formData.append("callbackNo", this.mes.callbackNo);
        formData.append("message", this.mes.message);

        this.http
        .post(environment.apiPath + "/sendMail.php",formData)
        .subscribe(
            (res:any)=> { });

        this.isSend=true;
    }

    validate() {
      console.log("pl", this.mes.messageType)
      let valid=true;
      if(this.mes.subject==null) 
          valid=false;
      if(this.mes.message==null)
          valid=false;
  
      this.isValid=valid;
  
      return valid;
  
    }

  setEmergency() {
    if (this.mes.messageType=="Problem") {
      this.isEmergency=true;
    }
    else {
      this.isEmergency=false;
    }
  }
}

const Message = {
  messageType: null,
  subject: null,
  message: null,
  callbackNo: null
}


