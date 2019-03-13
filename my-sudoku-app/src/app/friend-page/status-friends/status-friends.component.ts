import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/user';
import { Friend } from 'src/app/shared/friend';


@Component({
  selector: 'app-status-friends',
  templateUrl: './status-friends.component.html',
  styleUrls: ['./status-friends.component.css']
})
export class StatusFriendsComponent implements OnInit {
  User: User[];   
  friend: Friend[]=[];
  friend_status_hold: string[]=[]
  id:string;

  constructor(public authApi: AuthService) { }

  ngOnInit() {
    let s = this.authApi.GetUsersList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.authApi.getSessionStorage())
        {
          this.id=item.key ;
          a['$key'] = item.key;
          this.User.push(a as User);
          this.friend = Object.assign(this.friend,this.User[0].friendList);
          for (var i = 0; i < this.friend.length; i++) 
          {
            if (this.friend[i].status==="hold")
            {
              // console.log(this.friend[i].friendName)
              this.friend_status_hold[i]=this.friend[i].friendName;
              //console.log(this.friend_status_hold[i])
            }
          }
        }
      })
    })
    
  }

}
