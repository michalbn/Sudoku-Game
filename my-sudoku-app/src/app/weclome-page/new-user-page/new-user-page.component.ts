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
  
  constructor(private router: Router,
              public authApi: AuthService,  // auth API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,  // Toastr service for alert message) { }

 ) { }
  ngOnInit() {
   this.authApi.GetUsersList;  // Call GetUsersList() before main form is being called
    this.useForm();
  
  }

    // Reactive user form
  useForm() {
    this.userForm = this.fb.group({
      nickName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]]
    })  
  }

    // Accessing form control using getters
    get nickName() {
      return this.userForm.get('nickName');
    }

    // Reset user form's values
  ResetForm() {
    this.userForm.reset();
  } 

  submitUserData()//add user to firebase
  {
  
    this.authApi.GetUsersList().valueChanges().subscribe(collection => {
      if(collection.length==0)//if nothing in the firebase
      {
        this.authApi.AddUser(this.userForm.value); // Submit student data using CRUD
          //this.toastr.success(this.studentForm.controls['firstName'].value + ' successfully added!'); // Show success message when data is successfully submited
          this.ResetForm();  // Reset form when clicked on reset button
          this.router.navigate(['/home-page']);  
      }

      for (var i = 0; i < collection.length; i++) 
      {
        if(collection[i].nickName===this.userForm.value.nickName)
        {
          this.ResetForm();  // Reset form when clicked on reset button
          this.toastr.error('!כינוי זה כבר קיים, בחר כינוי אחר', '!אופס');
          break;
        }
        if(i===collection.length-1)
        {
          this.authApi.AddUser(this.userForm.value); // add user to firebase
          this.ResetForm();  // Reset form when clicked on reset button
          this.router.navigate(['/home-page']);  
          i=collection.length;
          break;
        }
      }
      })
  }
  

}
