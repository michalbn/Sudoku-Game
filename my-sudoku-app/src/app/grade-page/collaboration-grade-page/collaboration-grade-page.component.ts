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

  flagGrade2=false;//flag -If there are no grades
  gradeInfo2: string[]=[];//My grade list

  constructor(public messageService: MessageService,
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
        this.messageService.alertMsg(this.router.url)
        this.gradeInfo2=[];
        this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {
            if(this.router.routerState.snapshot.url === "/grade-page/collaboration")
            {
              if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())
              {
                this.authApi.valid=collection[i].key//user id
                if(collection[i].payload.val().gradeCollaboration[0]["boardName"]!=="")
                {
                  this.flagGrade2=true;
                  for (var j = 0; j < collection[i].payload.val().gradeCollaboration.length; j++)
                  {
                    //My grade list
                   this.gradeInfo2.push(collection[i].payload.val().gradeCollaboration[j]) 
                  } 
                }
                else
                {
                  //There are no grades
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
