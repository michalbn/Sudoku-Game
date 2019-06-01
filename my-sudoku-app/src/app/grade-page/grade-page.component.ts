import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-grade-page',
  templateUrl: './grade-page.component.html',
  styleUrls: ['./grade-page.component.css']
})
export class GradePageComponent implements OnInit,DoCheck {
  gradePage = false;
  path : string;
  flagGrade=false;

  gradeInfo: string[]=[];//My friend list - status approved


  constructor(private router : Router,
              private route: ActivatedRoute,public authApi: AuthService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      this.gradeInfo=[];
      this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())
          {
            if(collection[i].payload.val().grade[0]["boardName"]!=="")
            {
              this.flagGrade=true;
              for (var j = 0; j < collection[i].payload.val().grade.length; j++)
              {
               this.gradeInfo.push(collection[i].payload.val().grade[j]) 
              } 
            }
            else
            {
              this.flagGrade=false;
            }
          }
        }
      })

    }
    console.log(this.gradeInfo)
  }

  ngDoCheck()//after any change meybe subscribe video 11
  {
    
    this.path = this.router.routerState.snapshot.url
    if (this.path == "/grade-page")
    {
      this.gradePage=true;
    }
    else
    {
      this.gradePage=false;
    }
  }

}
