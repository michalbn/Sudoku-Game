import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { MessageService } from '../shared/message.service';


@Component({
  selector: 'app-grade-page',
  templateUrl: './grade-page.component.html',
  styleUrls: ['./grade-page.component.css']
})
export class GradePageComponent implements OnInit,DoCheck {
  gradePage = false;//flag for url path
  path : string;//url path
  flagGrade=false;//flag -If there are no grades

  gradeInfo: string[]=[];//My grade list

  constructor(private router : Router,
              private route: ActivatedRoute,public authApi: AuthService,
              private messageService: MessageService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      if(this.router.routerState.snapshot.url === "/grade-page")
      {
        this.gradeInfo=[];
        this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {
            if(this.router.routerState.snapshot.url === "/grade-page")
            {
              if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())
              {
                this.authApi.valid=collection[i].key//user id
                if(collection[i].payload.val().grade[0]["boardName"]!=="")
                {
                  this.flagGrade=true;
                  for (var j = 0; j < collection[i].payload.val().grade.length; j++)
                  {
                    //My grade list
                   this.gradeInfo.push(collection[i].payload.val().grade[j]) 
                  } 
                }
                else
                {
                  //There are no grades
                  this.flagGrade=false;
                  break;
                }
              }
            }
            else
            {
              break;
            }
          }
        })
        //Check if my friends have called me to play
        this.messageService.alertMsg(this.router.url)
      }
    }
  }

  ngDoCheck()//check if i'm in the path "/grade-page"
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
