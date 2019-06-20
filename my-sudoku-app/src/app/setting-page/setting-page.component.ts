import { Component, OnInit } from '@angular/core';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {

    this.messageService.alertMsg(SettingPageComponent)
    
    
  }

}
