import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { Friend } from '../shared/friend';
import { User } from '../shared/user';


@Component({
  selector: 'app-friend-page',
  templateUrl: './friend-page.component.html',
  styleUrls: ['./friend-page.component.css']
})
export class FriendPageComponent implements OnInit,DoCheck {
  friendPage = false;
  path: string;
  public friendForm: FormGroup;
  counter=0;
  exist:number;
 

  User: User[];   
  friend: Friend[]=[];
  id:string;
  

  constructor(private router : Router,
              private route: ActivatedRoute,
              public authApi:AuthService ,  // CRUD API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,
              
  ) { }

  ngOnInit() {
    let s = this.authApi.GetUsersList(); 
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if(a["nickName"]===this.authApi.getSessionStorage())
        {
          this.id=item.key 
          a['$key'] = item.key;
          this.User.push(a as User);
        }
      })
    })
    this.frienForm();  
   // this.friend= new Array();  
    
  }

    // Reactive student form
    frienForm() {
      this.friendForm = this.fb.group({
        friendName: ['', [Validators.required]],
      })  
    }

    get friendName() {
      return this.friendForm.get('friendName');
    }

  ngDoCheck()//after any change meybe subscribe video 11
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

  ResetForm() {
    this.friendForm.reset();
  }  

  addFriend()
  {
      //console.log(this.friendForm.value.friendName)
      this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
        //console.log(collection)
        for (var i = 0; i < collection.length; i++) 
        {
          //console.log(this.authApi.friend)
          if(collection[i].payload.val().nickName===this.friendForm.value.friendName && collection[i].payload.val().nickName!==this.authApi.getSessionStorage())
          {
            
            if(this.User[0].friendList[0]==null)
            {
              this.friend.push({friendName:this.friendForm.value.friendName, status:"hold"});
              this.authApi.UpdateUserFriend(this.id, this.User[0],this.friend)
              this.toastr.success('נישלחה בקשת חברות', '');
              //console.log(this.User[0].friendList[0])
              this.ResetForm();
              break;
            }
            else
            {
              this.friend = Object.assign(this.friend,this.User[0].friendList);
              
              for(var i=0;i<this.friend.length;i++)
              {
                  console.log(this.friend[i]["friendName"])
                  if(this.friend[i]["friendName"]===this.friendForm.value.friendName)
                    {
                      this.toastr.error('כבר שלחת בקשה לחבר זה', '!אופס');
                      this.exist=1;
                      this.ResetForm();
                      break;
                    }
              }
              if(this.exist!=1)
              {
                 //console.log(this.friend)
                //his.friend=this.User[0].friendList
                this.friend.push({friendName:this.friendForm.value.friendName, status:"hold"});
                this.toastr.success('נישלחה בקשת חברות', '');
                //console.log(this.friend)
                this.authApi.UpdateUserFriend(this.id, this.User[0],this.friend)
                //console.log(this.User[0].friendList)
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
          this.ResetForm();  // // reset input text
          this.toastr.info('טעות, הכנסת את הכינוי שלך');
          this.counter=0;
        }
        else if(this.counter===collection.length && this.counter!==0 && this.friendForm.value.friendName!==null)//check validation
        {
          this.ResetForm();  // // reset input text
          this.toastr.error('!משתמש זה לא קיים ', '!אופס');
          this.counter=0;
        }
        else
        this.counter=0;
        this.exist=0;
      })

      //console.log(this.authApi.friend)
  }

}
