import { Component, OnInit } from '@angular/core';
import { MessageService } from '../shared/message.service';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {
  
  User: User[];//my user
  id: string;//user id

  constructor(private messageService: MessageService,
              public authApi: AuthService,
              private router: Router,
              private db: AngularFireDatabase) { }

  ngOnInit() {

    this.messageService.alertMsg(this.router.url)

    let s = this.authApi.GetUsersList(); //list of users
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();

        if (a["nickName"] === this.authApi.getSessionStorage() && this.authApi.getSessionStorage() !== "" && this.router.routerState.snapshot.url === "/setting") {
          this.id = item.key;
          this.authApi.valid=this.id
          a['$key'] = item.key;
          this.User.push(a as User);//my user list
        }
      })
    })
    
    
  }

  defult()//Change colors by default
  {
    //Updated change in session and in db
    this.authApi.BackgroundColor="#FFFFFF";
    this.authApi.updateSessionColorBackgroundColor("#FFFFFF")
    this.db.object('users-list/'+this.id+'/color/BackgroundColor').set("#FFFFFF")

    this.authApi.headersColor="#87CEFA";
    this.authApi.updateSessionColorheadersColor("#87CEFA")
    this.db.object('users-list/'+this.id+'/color/headersColor').set("#87CEFA")

    this.authApi.BackgroundBoardColor="#FFFFFF";
    this.authApi.updateSessionColorBackgroundBoardColor("#FFFFFF")
    this.db.object('users-list/'+this.id+'/color/BackgroundBoardColor').set("#FFFFFF")
  
    this.authApi.numbersColor="#000000";
    this.authApi.updateSessionColornumbersColor("#000000")
    this.db.object('users-list/'+this.id+'/color/numbersColor').set("#000000")

    this.authApi.helpNumbersColor="#BCE0F7";
    this.authApi.updateSessionColorhelpNumbersColor("#BCE0F7")
    this.db.object('users-list/'+this.id+'/color/helpNumbersColor').set("#BCE0F7")

  }

  //Change and update the background color (also in db)
  favcolor1(event: any)
  {
    // [style.style.backgroundcolor]="this.authApi.BackgroundBoardColor"
    this.authApi.BackgroundColor=event;
    this.authApi.updateSessionColorBackgroundColor(event)
    this.db.object('users-list/'+this.id+'/color/BackgroundColor').set(event)

  }

  //Change and update the title color (also in db)
  favcolor2(event: any)
  {
    this.authApi.headersColor=event;
    this.authApi.updateSessionColorheadersColor(event)
    this.db.object('users-list/'+this.id+'/color/headersColor').set(event)

  }

  //Change and update the background color of the clipboard (also in db)
  favcolor3(event: any)
  {
    this.authApi.BackgroundBoardColor=event;
    this.authApi.updateSessionColorBackgroundBoardColor(event)
    this.db.object('users-list/'+this.id+'/color/BackgroundBoardColor').set(event)

  }

  //Change and update the color of the numbers in the panel (also in db)
  favcolor4(event: any)
  {
    this.authApi.numbersColor=event;
    this.authApi.updateSessionColornumbersColor(event)
    this.db.object('users-list/'+this.id+'/color/numbersColor').set(event)
  }

  //Change and update the color of the help numbers on the panel (also in db)
  favcolor5(event: any)
  {
    this.authApi.helpNumbersColor=event;
    this.authApi.updateSessionColorhelpNumbersColor(event)
    this.db.object('users-list/'+this.id+'/color/helpNumbersColor').set(event)
  }

}
