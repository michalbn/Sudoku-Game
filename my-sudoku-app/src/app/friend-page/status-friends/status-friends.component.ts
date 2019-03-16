import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/user';
import { Friend } from 'src/app/shared/friend';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-status-friends',
  templateUrl: './status-friends.component.html',
  styleUrls: ['./status-friends.component.css']
})
export class StatusFriendsComponent implements OnInit {
  User: User[];   
  friend: Friend[]=[];
  friend_status_hold: string[]=[];
  friendRequest: string[]=[];
  friendDetail: string[]=[];
  id: string;



  constructor(public authApi: AuthService, private router : Router,private db: AngularFireDatabase) { }

  ngOnInit() { 
    let s = this.authApi.GetUsersList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.authApi.getSessionStorage()&& this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
        {
          this.id=item.key ;
          a['$key'] = item.key;
          this.User.push(a as User);
          
          this.friend = Object.assign(this.friend,this.User[0].friendList);
          this.friend_status_hold=[];

        }
      })
      for (var i = 0; i < this.friend.length; i++) 
      {
        if (this.friend[i].status==="hold")
        {
          this.friend_status_hold.push(this.friend[i].friendName)
        }
      }
    })
    
    var temp: string[]=[]
    
       this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().friendList.length!=undefined && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
          {
            for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
              {              
                if(collection[i].payload.val().friendList[j].friendName===this.authApi.getSessionStorage() && collection[i].payload.val().friendList[j].status==="hold")
                {
                  if(this.friendRequest.length==0)
                  {
                    this.friendRequest.push(collection[i].payload.val().nickName)
                    temp.push(collection[i].key, j.toString(), collection[i].payload.val().nickName)
                    this.friendDetail.push(temp.toString())
                    temp=[];
                    break
                  }
                  else
                  {
                    for (var k = 0; k < this.friendRequest.length; k++)
                    {
                      if(collection[i].payload.val().nickName===this.friendRequest[k])
                      {
                          k=this.friendRequest.length
                          j=collection[i].payload.val().friendList.length
                          break;
                      }
                    }
                    if(k!==this.friendRequest.length||j!==collection[i].payload.val().friendList.length)
                    {
                      this.friendRequest.push(collection[i].payload.val().nickName)
                      temp.push(collection[i].key, j.toString(), collection[i].payload.val().nickName)
                      this.friendDetail.push(temp.toString())
                      temp=[];
                      break 
                    }
                  }  
                }
              }
              
            }
          }
      })  

  }
  

  confirm(Request)
  {
    console.log(this.User)
    for (var i = 0; i < this.friendDetail.length; i++)
    {
      var res:string[]=[]
      var addFriend:Friend[]=[]
      res= this.friendDetail[i].split(",");
      if(res[2]===Request)
      {
        this.db.database.ref("users-list/"+res[0]+"/friendList/"+res[1]+"/status").set("approved")
        if(this.User[0].friendList[0]==null)
        {
          addFriend.push({friendName: Request, status:"approved"});
          this.authApi.UpdateUserFriend(this.id, this.User[0],addFriend)
        }
        else
        {
          addFriend = Object.assign(addFriend,this.User[0].friendList);
          addFriend.push({friendName: Request, status:"approved"});
          this.authApi.UpdateUserFriend(this.id, this.User[0],addFriend)

        }
        res=[];
        break;
      }
    }
    this.friendDetail=[];
    this.friendRequest=[];
    this.friend=[]
    this.ngOnInit();
    
  }

  cancel(Request)
  {
    for (var i = 0; i < this.friendDetail.length; i++)
    {
      var res:string[]=[]
      res= this.friendDetail[i].split(",");
      if(res[2]===Request)
      {
        this.db.database.ref("users-list/"+res[0]+"/friendList/"+res[1]+"/status").set("cancelled")
        res=[];
        break;
      }
    }
    this.friendDetail=[];
    this.friendRequest=[];
    this.friend=[]
    this.ngOnInit();
  }

}
