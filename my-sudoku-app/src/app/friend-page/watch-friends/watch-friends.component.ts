import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user';
import { Friend } from 'src/app/shared/friend';


@Component({
  selector: 'app-watch-friends',
  templateUrl: './watch-friends.component.html',
  styleUrls: ['./watch-friends.component.css']
})
export class WatchFriendsComponent implements OnInit {

  User: User[];   
  friend: Friend[]=[];
  status_approved: string[]=[];


  constructor(public authApi: AuthService, private router : Router) { }

  ngOnInit() {
    let s = this.authApi.GetUsersList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.authApi.getSessionStorage()&& this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/watch-friends")
        {
          //this.id=item.key ;
          a['$key'] = item.key;
          this.User.push(a as User);
          this.friend = Object.assign(this.friend,this.User[0].friendList);
          this.status_approved=[];
        }
      })
      if(this.router.routerState.snapshot.url ==="/friends-page/watch-friends")
      {
        for (var i = 0; i < this.friend.length; i++) 
        {
          if (this.friend[i].status==="approved")
          {
          
            this.status_approved.push(this.friend[i].friendName)
            console.log(this.status_approved)
          }
        }
      }
    })
  }
}


