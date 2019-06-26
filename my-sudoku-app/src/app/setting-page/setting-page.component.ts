import { Component, OnInit } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

  constructor(private messageService: MessageService,public authApi: AuthService) { }

  ngOnInit() {

    this.messageService.alertMsg(SettingPageComponent)
    
    
  }

  defult()
  {
    this.authApi.BackgroundColor= "#FFFFFF"
    this.authApi.headersColor= "#87CEFA"
    this.authApi.BackgroundBoardColor="#FFFFFF"
  }


  favcolor1(event: any)
  {
    console.log(event)
    // [style.style.backgroundcolor]="this.authApi.BackgroundBoardColor"
    this.authApi.BackgroundColor=event;

  }


  favcolor2(event: any)
  {
    console.log(event)
    this.authApi.headersColor=event;
  }

  favcolor3(event: any)
  {
    console.log(event)
    this.authApi.BackgroundBoardColor=event;
  }

  favcolor4(event: any)
  {
    console.log(event)
    this.authApi.numbersColor=event;
  }

  favcolor5(event: any)
  {
    console.log(event)
    this.authApi.helpNumbersColor=event;
  }

}
