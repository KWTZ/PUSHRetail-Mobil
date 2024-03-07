import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';

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
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.promoter=JSON.parse(localStorage.getItem('promoter'));
  }

  setSend() {
    this.isSend=true;   
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


