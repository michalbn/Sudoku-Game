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
      this.authApi.delSessionStorage();
      
    }

    // Reactive user form
    useForm() {
      this.userForm = this.fb.group({
        nickName: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.pattern('^[0-9]+$'),Validators.minLength(4),Validators.maxLength(6)]]
      })  
    }

    get nickName() {//get user nickName
      return this.userForm.get('nickName');
    }
    get password() {
      return this.userForm.get('password');
    }

    ResetForm() {// reset input text
      this.userForm.reset();
    }  

  Continue_to_home_page()//when you click on the button
  {
    console.log(this.authApi.GetUsersList())
    this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
      if(collection.length==0 && this.authApi.disconnect==undefined)//if nothing in the firebase
      {
        this.ResetForm();  // reset input text
        this.toastr.error('!לא קיימים משתמשים צור משתמש חדש', '!אופס');
        
      }
      
      else//if something in the firebase
      {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().nickName===this.userForm.value.nickName)
          {
            if(collection[i].payload.val().password===this.userForm.value.password)
          {
            

           // console.log(JSON.stringify(collection[i]))
           //this.db.database.ref("users-list/"+collection[i].key+"/login").set(true)
            this.authApi.userLogin=this.userForm.value.nickName//user exist
            this.authApi.BackgroundColor=collection[i].payload.val().color.BackgroundColor
            this.authApi.headersColor=collection[i].payload.val().color.headersColor
            this.authApi.BackgroundBoardColor=collection[i].payload.val().color.BackgroundBoardColor
            this.authApi.helpNumbersColor=collection[i].payload.val().color.helpNumbersColor
            this.authApi.numbersColor=collection[i].payload.val().color.numbersColor
            console.log(this.authApi.numbersColor)
           // this.authApi.DeleteUser(collection[i].key)
            //this.authApi.AddUser(collection[i].payload.val(),true)
            this.authApi.UpdateUserLogin(collection[i].key,collection[i].payload.val(),true)
            this.ResetForm();  // // reset input text
            this.router.navigate(['/home-page']);//go to home-page
            break;
          }
          else
          {
            this.count=collection.length;
            break;
          }
        
        }
        else
        {
          this.count++;//invalid user name
        }
      
        }
        if(this.count===collection.length && this.userForm.value.nickName!==null && this.userForm.value.password!==null)//check validation
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
