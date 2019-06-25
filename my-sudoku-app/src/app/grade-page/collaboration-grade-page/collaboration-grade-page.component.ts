import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/message.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-collaboration-grade-page',
  templateUrl: './collaboration-grade-page.component.html',
  styleUrls: ['./collaboration-grade-page.component.css']
})
export class CollaborationGradePageComponent implements OnInit {

  flagGrade2=false;
  gradeInfo2: string[]=[];//My friend list - status approved

  constructor(private messageService: MessageService,
    private router : Router,
    public authApi: AuthService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      if(this.router.routerState.snapshot.url === "/grade-page/collaboration")
      {
        this.messageService.alertMsg(CollaborationGradePageComponent)
        this.gradeInfo2=[];
        this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {
            if(this.router.routerState.snapshot.url === "/grade-page/collaboration")
            {
              if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())
              {
                if(collection[i].payload.val().gradeCollaboration[0]["boardName"]!=="")
                {
                  this.flagGrade2=true;
                  for (var j = 0; j < collection[i].payload.val().gradeCollaboration.length; j++)
                  {
                   this.gradeInfo2.push(collection[i].payload.val().gradeCollaboration[j]) 
                  console.log(this.gradeInfo2)
                  } 
                }
                else
                {
                  this.flagGrade2=false;
                }
              }
            }
            else
            {
              break;
            }
          }
          return;
        })
      }
    }

  }
  
  

}
