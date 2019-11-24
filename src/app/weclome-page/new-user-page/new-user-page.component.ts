import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.css']
})
export class NewUserPageComponent implements OnInit {
  public userForm: FormGroup;
  count=0;//flag
  friendName='';
  status='';
  
  
  constructor(private router: Router,
              public authApi: AuthService,  // auth API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,  // Toastr service for alert message) { }

 ) { }
  ngOnInit() {
    this.authApi.GetUsersList;  // Call GetUsersList() before main form is being called
    this.useForm();
    this.authApi.delSessionStorage();
  }

  //Reactive user form
  useForm() {
    this.userForm = this.fb.group({
      nickName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern('^[0-9]+$'),Validators.minLength(4),Validators.maxLength(6)]]
    })  
  }
  //Accessing form control using getters
  get nickName() {
    return this.userForm.get('nickName');
  }
  get password() {
    return this.userForm.get('password');
  }

  //Reset user form's values
  ResetForm()
  {
    this.userForm.reset();
  } 

  submitUserData()//add user to firebase
  {
      this.authApi.GetUsersList().valueChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].nickName===this.userForm.value.nickName)//if user exist in firebase
          {
            this.ResetForm();  // reset input text
            this.toastr.error('!כינוי זה כבר קיים, בחר כינוי אחר', '!אופס');
            this.count=0;
            break;
          }
          else
          {
            this.count++;
          }
        }
        if(this.count===collection.length && this.userForm.value.nickName!==null)//if user not exsit in the firebase
        {
          this.authApi.userLogin=this.userForm.value.nickName;//add nickName to global variable
          this.authApi.BackgroundColor="#FFFFFF"
          this.authApi.headersColor="#87CEFA"
          this.authApi.BackgroundBoardColor="#FFFFFF"
          this.authApi.helpNumbersColor="#BCE0F7"
          this.authApi.numbersColor="#000000"
          this.authApi.AddUser(this.userForm.value,true,this.friendName,this.status,1000); // Submit user data using auth service
          this.ResetForm();  // reset input text
          this.router.navigate(['/home-page']);  
        }
    })
  }
  
}

