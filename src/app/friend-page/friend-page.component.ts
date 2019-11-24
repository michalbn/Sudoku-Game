import { Component, OnInit, DoCheck } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { Friend } from '../shared/friend';
import { User } from '../shared/user';
import { MessageService } from '../shared/message.service';


@Component({
  selector: 'app-friend-page',
  templateUrl: './friend-page.component.html',
  styleUrls: ['./friend-page.component.css']
})
export class FriendPageComponent implements OnInit,DoCheck {
  friendPage = false;//check if i'm in the path "/friends-page"
  path: string;//my URL
  public friendForm: FormGroup;//Enter the name of the member in the relevant field
  counter=0;//Count my friends
  exist:number;//flag
 
  User: User[];//My user
  friend: Friend[]=[];//My friends list
  id:string;//my id

  constructor(private router : Router,
              public authApi:AuthService ,  // API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,
              public messageService: MessageService
              
  ) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      let s = this.authApi.GetUsersList(); 
      s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
        this.User = [];
        data.forEach(item => {
          let a = item.payload.toJSON();
          if(a["nickName"]===this.authApi.getSessionStorage() && this.router.url ==="/friends-page" )
          {
            this.id=item.key //save user id
            this.authApi.valid=this.id
            a['$key'] = item.key;
            this.User.push(a as User);//save user details
          }
        })
      })
      this.frienForm();//init  
     this.messageService.alertMsg(this.router.url)//Check if my friends have called me to play
    }
  }

    // Reactive user form
  frienForm() 
  {
    this.friendForm = this.fb.group({
      friendName: ['', [Validators.required]],
    })  
  }

  get friendName() {//get friend name
      return this.friendForm.get('friendName');
  }

  ngDoCheck()//check if i'm in the path "/friends-page"
  {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      this.path = this.router.routerState.snapshot.url
      if (this.path == "/friends-page")
      {
        this.friendPage=true;
      }
      else
      {
        this.friendPage=false;
      }
    }
  }

  ResetForm() {//Delete relevant field
    this.friendForm.reset();
  }  

  addFriend()//Add a friend to my friends list
  {
    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      for (var i = 0; i < collection.length; i++) 
      {
        var checkFriend:Friend[]=[]//temp friends list
        if(this.friendForm.value.friendName===collection[i].payload.val().nickName)//If this nickname exists in DB
        {
          checkFriend = Object.assign(checkFriend,collection[i].payload.val().friendList);//Add a friend to temp friends list
          for (var k = 0; k < checkFriend.length; k++) 
          {
            //If this friend has already sent me a friend request
            if(checkFriend[k].friendName===this.authApi.getSessionStorage() && checkFriend[k].status==="hold")
            {
              this.toastr.error('כבר נשלחה בקשת חברות', '!אופס');
              this.exist=1;//change flag
              this.ResetForm();
              break;
            }
          }
        }
        //If this user exists and his name is not the name of my user
        if(collection[i].payload.val().nickName===this.friendForm.value.friendName && collection[i].payload.val().nickName!==this.authApi.getSessionStorage())
        {
          if(this.User[0].friendList[0]==null)//If I do not have friends
          {
            //Add this friend
            this.friend.push({friendName:this.friendForm.value.friendName, status:"hold"});
            this.authApi.UpdateUserFriend(this.id, this.User[0],this.friend)
            this.toastr.success('נישלחה בקשת חברות', '');
            this.exist=0;
            this.ResetForm();
            break;
          }
          else//If I have friends
          {
            this.friend = Object.assign(this.friend,this.User[0].friendList);
            for(var j=0;j<this.friend.length;j++)
            {
              if(this.friend[j]["friendName"]===this.friendForm.value.friendName && this.friend[j]["status"]==="hold" )
              {
                //I have already sent this friend a friend request
                this.toastr.error('כבר נשלחה בקשת חברות', '!אופס');
                this.exist=1;
                this.ResetForm();
                break;
              }
              if(this.friend[j]["friendName"]===this.friendForm.value.friendName && this.friend[j]["status"]==="approved" )
              {
                //We are already friends
                this.toastr.error('אתם כבר חברים', '!אופס');
                this.exist=1;
                this.ResetForm();
                break;
              }
              if(this.friend[j]["friendName"]===this.friendForm.value.friendName && this.friend[j]["status"]==="cancelled" )
              {
                //If the friend has canceled the membership request
                this.friend.splice(j, 1); //delete friend from my friends list
                this.exist=0;
                break;
              }
            }
            //If the flag  different than 1 - send a membership request
            if(this.exist!=1)
            {
              this.friend.push({friendName:this.friendForm.value.friendName, status:"hold"});
              this.toastr.success('נישלחה בקשת חברות', '');
              this.counter=0;
              this.authApi.UpdateUserFriend(this.id, this.User[0],this.friend);//update db
              this.friend=[];
              this.ResetForm();
              break;
            }
          }
        }
        else
        {
          this.counter++;
        }
      }
      if(this.friendForm.value.friendName===this.authApi.getSessionStorage() && this.counter==collection.length && this.counter!==0 && this.friendForm.value.friendName!==null)
      {
        //If I entered my nickname
        this.ResetForm();  // // reset input text
        this.toastr.info('טעות, הכנסת את הכינוי שלך');
        this.counter=0;
        this.friend=[];  
      }
      else if(this.counter===collection.length && this.counter!==0 && this.friendForm.value.friendName!==null)//check validation
      {
        //This user does not exist
        this.ResetForm();  // // reset input text
        this.toastr.error('!משתמש זה לא קיים ', '!אופס');
        this.counter=0;
        this.friend=[];
      }
      else
      {
        this.counter=0;
        this.exist=0;
        this.friend=[];
      }
    })
  }
}
