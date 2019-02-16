import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { database } from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
userName: string
today: number = Date.now();
User: User[];   
id:string;
  constructor(public authApi: AuthService,
              private router: Router,
              private actRoute: ActivatedRoute,
             ) { }

  ngOnInit() {   
    
    let s = this.authApi.GetUsersList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.userName)
        {
          this.id=item.key 
          a['$key'] = item.key;
          this.User.push(a as User);
        }
      })
    })
    this.today = Date.now();//showing the date
    this.userName=this.authApi.userLogin;//enter the global nickName to variable
    if(this.userName!=null)//if global variable not null
    {
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

    // Contains Reactive Form logic


  logout()
  {
    console.log(this.User[0]);
    this.authApi.UpdateUserLogin(this.id,this.User[0],false)
    this.authApi.disconnect=0;
    this.authApi.delSessionStorage();
    this.userName=null;
    this.router.navigate(['/']);//go to new-user
  }
  

}
