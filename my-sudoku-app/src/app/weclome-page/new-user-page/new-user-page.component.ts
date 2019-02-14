import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { WeclomePageComponent } from '../weclome-page.component';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.css']
})
export class NewUserPageComponent implements OnInit {
  public userForm: FormGroup;
  
  constructor(private router: Router,
              public authApi: AuthService,  // auth API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,  // Toastr service for alert message) { }

 ) { }
  ngOnInit() {
    this.authApi.GetUsersList;  // Call GetUsersList() before main form is being called
    this.useForm();
  }

  //Reactive user form
  useForm() {
    this.userForm = this.fb.group({
    nickName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]]
    })  
  }
  //Accessing form control using getters
  get nickName() {
    return this.userForm.get('nickName');
  }

  //Reset user form's values
  ResetForm() {
    this.userForm.reset();
  } 

  submitUserData()//add user to firebase
  {
    this.authApi.GetUsersList().valueChanges().subscribe(collection => {
    if(collection.length==0)//if nothing in the firebase
    {
      this.authApi.userLogin=this.userForm.value.nickName //insert nickName to global variable
      console.log( this.authApi.userLogin)
      this.authApi.AddUser(this.userForm.value); // Submit user data using auth service
      this.ResetForm();  //reset input text
      this.router.navigate(['/home-page']);     
    }
    else
    {
      for (var i = 0; i < collection.length; i++) 
      {
        if(collection[i].nickName===this.userForm.value.nickName)//if user exist in firebase
        {
          this.ResetForm();  // reset input text
          this.toastr.error('!כינוי זה כבר קיים, בחר כינוי אחר', '!אופס');
          break;
        }
        if(i===collection.length-1)//if user not exsit in the firebase
        {
          this.authApi.userLogin=this.userForm.value.nickName//add nickName to global variable
          this.authApi.AddUser(this.userForm.value); // add user to firebase
          this.ResetForm();  // reset input text
          this.router.navigate(['/home-page']); 
          i=collection.length;
          break;
        }
      }
    }
  })
}
  
}

