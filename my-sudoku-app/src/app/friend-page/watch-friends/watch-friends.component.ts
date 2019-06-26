import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user';
import { Friend } from 'src/app/shared/friend';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-watch-friends',
  templateUrl: './watch-friends.component.html',
  styleUrls: ['./watch-friends.component.css']
})
export class WatchFriendsComponent implements OnInit {

  User: User[];// My user   
  friend: Friend[]=[];//My friend list
  status_approved: string[]=[];//My friend list - status approved
  id:string;//My user id

  constructor(public authApi: AuthService, private router : Router,private messageService: MessageService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      this.status_approved=[];
      let s = this.authApi.GetUsersList(); //find my user
      s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
        this.User = [];
        this.friend = [];
        data.forEach(item => {
          let a = item.payload.toJSON();
          if(a["nickName"]===this.authApi.getSessionStorage()&& this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/watch-friends")
          {
            this.id=item.key ;
            this.authApi.valid=this.id
            a['$key'] = item.key;
            this.User.push(a as User);
            this.friend = Object.assign(this.friend,this.User[0].friendList);
            this.status_approved=[];
          }
        })
        if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/watch-friends")
        {
          for (var i = 0; i < this.friend.length; i++) //Shows my friends
          {
            if (this.friend[i].status==="approved")
            {
               this.status_approved.push(this.friend[i].friendName);
            }
          }
        }
      })
    }
    this.messageService.alertMsg(WatchFriendsComponent)
    

  }

  delete_friend(name)//delete my friend
  {
    var noneFriend: Friend[]=[];
    if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/watch-friends")//in my friend list
    {
      for (var i = 0; i < this.status_approved.length; i++) 
      {
        if(name===this.status_approved[i]&& name!==null)
        {
          if(this.status_approved.length===1)//If I have only one friend
          {
            noneFriend=[];
            this.status_approved.splice(i, 1);
            noneFriend["friendName"]="";
            noneFriend["status"]="";
            this.authApi.UpdateUserFriend(this.id, this.User[0],noneFriend);
            i = this.status_approved.length;
            this.ngOnInit();
            //name=null;
            break;
          }
          else//If I have more than one friend
          {
            noneFriend = Object.assign(noneFriend,this.User[0].friendList);
            noneFriend.splice(i, 1); 
            this.authApi.UpdateUserFriend(this.id, this.User[0],noneFriend);
            this.ngOnInit();
            //name=null;
            break;
          }
        }
      }
    }
    //Delete my user in my friend's list
    var temp: Friend[]=[];
    var delFriend: Friend[]=[];
    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/watch-friends")
      {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().nickName===name&&name!==null)
          {
            for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
            {
              if(collection[i].payload.val().friendList[j].friendName===this.authApi.getSessionStorage())
              {
                if(collection[i].payload.val().friendList.length===1)//If he has one friend
                {
                  delFriend["friendName"]="";
                  delFriend["status"]="";
                  this.authApi.UpdateUserFriend(collection[i].key, collection[i].payload.val(),noneFriend);
                  i = collection.length;
                  this.ngOnInit();
                  name=null;
                  break;
                }
                else//If he has more than one friend
                {
                  temp = Object.assign(temp,collection[i].payload.val().friendList);
                  temp.splice(j,1);
                  this.authApi.UpdateUserFriend(collection[i].key, collection[i].payload.val(),temp);
                  i = collection.length;
                  this.ngOnInit();
                  name=null;
                  break;
                }
              }
            }
          }
        }
      }
    })
  }
}


