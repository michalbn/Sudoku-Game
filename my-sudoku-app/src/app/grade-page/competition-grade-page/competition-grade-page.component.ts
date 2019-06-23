import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/message.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-competition-grade-page',
  templateUrl: './competition-grade-page.component.html',
  styleUrls: ['./competition-grade-page.component.css']
})
export class CompetitionGradePageComponent implements OnInit {


  flagGrade1=false;
  gradeInfo1: string[]=[];//My friend list - status approved


  constructor(private messageService: MessageService,
              private router : Router,
              public authApi: AuthService
    ) { }


  ngOnInit() {

    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      if(this.router.routerState.snapshot.url === "/grade-page/competition")
      {
        this.messageService.alertMsg(CompetitionGradePageComponent)
        this.gradeInfo1=[];
        this.authApi.GetUsersList().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {
            if(collection[i].payload.val().nickName===this.authApi.getSessionStorage())
            {
              if(collection[i].payload.val().gradeCompetition[0]["boardName"]!=="")
              {
                this.flagGrade1=true;
                for (var j = 0; j < collection[i].payload.val().gradeCompetition.length; j++)
                {
                 this.gradeInfo1.push(collection[i].payload.val().gradeCompetition[j]) 
                console.log(this.gradeInfo1)
                } 

              }
              else
              {
                this.flagGrade1=false;
              }
            }
          }
          return;
        })
      }
    }
  }

}
