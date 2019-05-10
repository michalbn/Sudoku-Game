import { Component, OnInit } from '@angular/core';
import { Friend } from '../shared/friend';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends-game-page',
  templateUrl: './friends-game-page.component.html',
  styleUrls: ['./friends-game-page.component.css']
})
export class FriendsGamePageComponent implements OnInit {
  User: User[];// My user   
  friend: Friend[]=[];//My friend list

  friends_list:string[]=[];
  friends_login:string[]=[];

  constructor(public authApi: AuthService, private router : Router) {
    
   }

  ngOnInit() {
    this.friends_list=[];
    let s = this.authApi.GetUsersList(); //find my user
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      this.friend = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.authApi.getSessionStorage()&& this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-game-page")
        {
          a['$key'] = item.key;
          this.User.push(a as User);
          this.friend = Object.assign(this.friend,this.User[0].friendList);
          this.friends_list=[];
          return;
        }
      })
      if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-game-page")
      {
        for (var i = 0; i < this.friend.length; i++) //Shows my friends
        {
          this.friends_list.push(this.friend[i].friendName);
        }        
      }
      this.friends_login=[]
      if(this.router.routerState.snapshot.url ==="/friends-game-page" && this.friends_list.length!=0)
      for (var i = 0; i < this.friends_list.length; i++) 
      {
        for (var j = 0; i < data.length; j++) 
        {
          if(data[j].payload.val().nickName===this.friends_list[i])
          {
            if(data[j].payload.val().login==true)
            {
              this.friends_login.push(this.friends_list[i])
              break;
            }
            else
            {
              break;
            }
          }
        }
      }
    })
  }

  check_fields()
  {
    console.log((document.getElementById('selectid') as HTMLInputElement).value)
    console.log((document.getElementById('selectid1') as HTMLInputElement).value)
    console.log((document.getElementById('selectid2') as HTMLInputElement).value)
  }
}
