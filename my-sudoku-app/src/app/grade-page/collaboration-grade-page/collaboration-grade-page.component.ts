import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-collaboration-grade-page',
  templateUrl: './collaboration-grade-page.component.html',
  styleUrls: ['./collaboration-grade-page.component.css']
})
export class CollaborationGradePageComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.alertMsg(CollaborationGradePageComponent)
  }
  
  

}
