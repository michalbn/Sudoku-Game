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
  count=0;
 

  User: User[];   
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
      console.log(this.friendForm.value.friendName)
      this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
        console.log(collection)
        for (var i = 0; i < collection.length; i++) 
        {
          console.log(this.authApi.friend)
          if(collection[i].payload.val().nickName===this.friendForm.value.friendName && collection[i].payload.val().nickName!==this.authApi.getSessionStorage())
          {
            
           
           this.authApi.friend.push({friendName:this.friendForm.value.friendName, status:"hold"});

           this.ResetForm();
            break;
          }
          else
          {
            this.count++;
          }
        }
        if(this.friendForm.value.friendName===this.authApi.getSessionStorage()&&this.count==collection.length)
        {
          this.ResetForm();  // // reset input text
          this.toastr.info('טעות, הכנסת את הכינוי שלך');
          this.count=0;
        }
        else if(this.count===collection.length && this.count!==0 && this.friendForm.value.friendName!==null)//check validation
        {
          this.ResetForm();  // // reset input text
          this.toastr.error('!משתמש זה לא קיים ', '!אופס');
          this.count=0;
        }
        else if(this.friendForm.value.friendName!==this.authApi.getSessionStorage())
        {
          this.authApi.UpdateUserFriend(this.id, this.User[0],this.authApi.friend)
        }
      })

      console.log(this.authApi.friend)
  }

}
