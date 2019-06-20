import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-competition-grade-page',
  templateUrl: './competition-grade-page.component.html',
  styleUrls: ['./competition-grade-page.component.css']
})
export class CompetitionGradePageComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.alertMsg(CompetitionGradePageComponent)
    
  }

}
