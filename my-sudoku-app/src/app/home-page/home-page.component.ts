import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
userName: string
today: number = Date.now();
  constructor(public authApi: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.today = Date.now();//showing the date
    this.userName=this.authApi.userLogin;//enter the global nickName to variable
    if(this.userName!=null)//if global variable not null
    {
          console.log("this.authApi.userLogin: "+ this.authApi.userLogin)
          this.authApi.setSessionStorage(this.authApi.userLogin);//setSessionStorage
    }

    else if(this.authApi.getSessionStorage()!=null)///if session not null
    {
      this.userName=this.authApi.getSessionStorage();//update global nickName
    }
    else
    {
      this.router.navigate(['/not-found']);//go to new-user
    }
  }

  logout()
  {
    this.authApi.delSessionStorage();
    this.userName=null;
    this.router.navigate(['/']);//go to new-user
  }
  

}
