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
              public authApi: AuthService,  // CRUD API services
              public fb: FormBuilder,       // Form Builder service for Reactive forms
              public toastr: ToastrService,  // Toastr service for alert message
    ) { }

    ngOnInit() {
     // this.authApi.GetUsersList();  // Call GetStudentsList() before main form is being called
      this.useForm();              // Call student form when component is ready
    }

    // Reactive student form
    useForm() {
      this.userForm = this.fb.group({
        nickName: ['', [Validators.required, Validators.minLength(3)]],
      })  
    }

    get nickName() {
      return this.userForm.get('nickName');
    }

    ResetForm() {
      this.userForm.reset();
    }  

  Continue_to_home_page()
  {
    this.authApi.GetUsersList().valueChanges().subscribe(collection => {
      if(collection.length==0)//if nothing in the firebase
      {
        this.ResetForm();  // Reset form when clicked on reset button
        this.toastr.error('!לא קיימים משתמשים צור משתמש חדש', '!אופס');
        
      }
      else{
      for (var i = 0; i < collection.length; i++) 
      {
        if(collection[i].nickName===this.userForm.value.nickName)
        {
          this.ResetForm();  // Reset form when clicked on reset button
          this.router.navigate(['/home-page']);
          break;
        }
        else{
          this.count++;
        }
      }
      if(this.count===collection.length && this.userForm.value.nickName!==null)
      {
        this.ResetForm();  // Reset form when clicked on reset button
       this.toastr.error('!משתמש זה לא קיים ', '!אופס');
       this.count=0;
       

      }
    }
      })
  }
  

  create_new_user()
  {
    this.router.navigate(['/new-user']);
  }



  

}
