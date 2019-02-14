import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-weclome-page',
  templateUrl: './weclome-page.component.html',
  styleUrls: ['./weclome-page.component.css']
})
export class WeclomePageComponent implements OnInit {
  public userForm: FormGroup;
  public count=0;
 
  

  constructor(private router: Router,
              public authApi: AuthService,  // AUTH API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,  // Toastr service for alert message
              ) { }

    ngOnInit() {
     // this.authApi.GetUsersList();  // Call GetStudentsList() before main form is being called
      this.useForm();              // Call user form when component is ready
      
    }

    // Reactive user form
    useForm() {
      this.userForm = this.fb.group({
        nickName: ['', [Validators.required, Validators.minLength(3)]],
      })  
    }

    get nickName() {//get user nickName
      return this.userForm.get('nickName');
    }

    ResetForm() {// reset input text
      this.userForm.reset();
    }  

  Continue_to_home_page()//when you click on the button
  {
    this.authApi.GetUsersList().valueChanges().subscribe(collection => {
      if(collection.length==0)//if nothing in the firebase
      {
        this.ResetForm();  // reset input text
        this.toastr.error('!לא קיימים משתמשים צור משתמש חדש', '!אופס');
        
      }
      else//if something in the firebase
      {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].nickName===this.userForm.value.nickName)
          {
           this.authApi.userLogin=this.userForm.value.nickName//user exist
           this.ResetForm();  // // reset input text
           this.router.navigate(['/home-page']);//go to home-page
           break;
          }
          else
          {
            this.count++;//invalid user name
          }
        }
        if(this.count===collection.length && this.userForm.value.nickName!==null)//check validation
        {
          this.ResetForm();  // // reset input text
          this.toastr.error('!משתמש זה לא קיים ', '!אופס');
          this.count=0;
        }
      }
    })
  }
  
  create_new_user()
  {
    this.router.navigate(['/new-user']);//go to new-user
  }





  

}
