import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/user';
import { Friend } from 'src/app/shared/friend';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { MessageService } from 'src/app/shared/message.service';



@Component({
  selector: 'app-status-friends',
  templateUrl: './status-friends.component.html',
  styleUrls: ['./status-friends.component.css']
})
export class StatusFriendsComponent implements OnInit {
  
  friend_status_hold: string[]=[];//contain a list of names that this user has sent membership request
  friendRequest: string[]=[];//Contains a list of names that have sent to this user membership request

  constructor(public authApi: AuthService, private router : Router,private db: AngularFireDatabase,private messageService: MessageService) { }

  ngOnInit() { 
     //Sending a friend request
     if(this.authApi.getSessionStorage()==null)///if session not null
     {
       this.router.navigate(['/']);//go to new-user
     }
     else
     {
      this.authApi.GetUsersList().snapshotChanges().subscribe(collection => { 
        this.friend_status_hold=[];//init
        for (var i = 0; i < collection.length; i++) 
        {     
          if(collection[i].payload.val().nickName===this.authApi.getSessionStorage() && this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
          {
            this.authApi.valid=collection[i].key//save user id
            if(collection[i].payload.val().friendList.friendName!=="")//friends Exist
            {
              for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
              {
                if(collection[i].payload.val().friendList[j].status==="hold")//Check status - "hold"
                {
                  this.friend_status_hold.push(collection[i].payload.val().friendList[j].friendName)
                }
              } 
            }
          }
        }
        return;
      })
      //Receive membership request
      this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
        this.friendRequest=[];//init
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().friendList.friendName!=="")//friends Exist
          {
            for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
            {
              if(collection[i].payload.val().nickName!==this.authApi.getSessionStorage() && this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
              {
                if(collection[i].payload.val().friendList[j].friendName===this.authApi.getSessionStorage() &&collection[i].payload.val().friendList[j].status==="hold")
                {
                  this.friendRequest.push(collection[i].payload.val().nickName)
                }
              }
            }
          }
        }
        return;
      })
     }
     //Check if my friends have called me to play
     this.messageService.alertMsg(this.router.url)

  }
  
  confirm(Request)//Confirmation of membership request
  {
    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
      {
        for (var i = 0; i < collection.length; i++) 
        {
          for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
          {
            //Change the status of the member on this user
            if(collection[i].payload.val().nickName===Request && collection[i].payload.val().friendList[j].friendName===this.authApi.getSessionStorage())
            {
              this.db.database.ref("users-list/"+collection[i].key+"/friendList/"+j+"/status").set("approved")
              i=collection.length;
              break;   
            }
          }
        }      
      }
      this.friend_status_hold=[];
      this.friendRequest=[];
      this.ngOnInit(); 
      return;
    })

    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      var addFriend:Friend[]=[];
      //Add this user to the other player's friends list
      if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
      {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())   
          {
            if(collection[i].payload.val().friendList.friendName===""&&Request!==null )//If he has no friends
            {
              addFriend=[];
              addFriend.push({friendName: Request, status:"approved"})
              this.authApi.UpdateUserFriend(collection[i].key, collection[i].payload.val(),addFriend)
              Request=null;
              addFriend=[];
              i=collection.length;
              break;
            }
            else
            {   
              if(Request!==null)
              {
                addFriend=[];
                for (var j = 0; j < collection[i].payload.val().friendList.length; j++) //If he has friends
                {
                  addFriend.push(collection[i].payload.val().friendList[j])
                }
                addFriend.push({friendName:Request, status:"approved"})
                this.authApi.UpdateUserFriend(collection[i].key, collection[i].payload.val(),addFriend);
                Request=null;
                i=collection.length;
                break;
              }
            }
          }
        }
      }  
      this.friend_status_hold=[];
      this.friendRequest=[];
      this.ngOnInit(); 
      return;
    })  
  }

  cancel(Request)//Cancel membership request
  {
    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-page/status-friends")
      {
        for (var i = 0; i < collection.length; i++) //Change the status of the member on this user - cancelled
        {
          for (var j = 0; j < collection[i].payload.val().friendList.length; j++)
          {
            if(collection[i].payload.val().nickName===Request &&Request!==null && collection[i].payload.val().friendList[j].friendName===this.authApi.getSessionStorage())
            {
              this.db.database.ref("users-list/"+collection[i].key+"/friendList/"+j+"/status").set("cancelled")
              i=collection.length;
              Request=null;
              break;
            }
          }
        }       
      }
      this.friend_status_hold=[];
      this.friendRequest=[];
      this.ngOnInit(); 
      return;
    })    
  }
}
