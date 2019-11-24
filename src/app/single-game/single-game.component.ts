import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { AuthService } from '../shared/auth.service';
import { MessageService } from '../shared/message.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {
  easyBoard: string[]=[];//my sudoku board - easy
  mediumBoard: string[]=[];//my sudoku board - medium
  hardBoard: string[]=[];//my sudoku board - hard

  User: User[];// My user   

  constructor(private router: Router,public boardSe : SudokuBoardsService, public authApi: AuthService,public messageService: MessageService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
    this.messageService.alertMsg(this.router.url)
    let s = this.authApi.GetUsersList(); //find my user
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        if (a["nickName"] === this.authApi.getSessionStorage() && this.authApi.getSessionStorage() !== "" && this.router.routerState.snapshot.url === "/single-game")
         {
          a['$key'] = item.key;
          this.authApi.valid=item.key;//user id
          this.User.push(a as User);//my user
          return;
         }
        })
      })
    }
  }

  play(level,difficulty)// play classic-game
  {

    this.router.navigate(['/classic-game',difficulty,level]);//go to classic-game
    level=null;
    difficulty=null;
  }

  mark(levelName)//mark in color the detail
  {
    if(document.getElementById(levelName).style.color=="rgb(2, 7, 136)")
      document.getElementById(levelName).style.color="black";
    else
    {
      document.getElementById(levelName).style.color="rgb(2, 7, 136)";
    }
    levelName=null;
  }

  //View the list of Sudoku boards
  modo(value: string)
  {
    this.easyBoard=[];
    this.mediumBoard=[];
    this.hardBoard=[];
    switch(value) {  
      case "קל": { 
        this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {     
            this.easyBoard.push(collection[i].payload.val()); 
          }
        })
         break;
      }
      case "בינוני": { 
        this.boardSe.GetBoardsListMedium().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          { 
            this.mediumBoard.push(collection[i].payload.val()); 
          }
        })
         break;
      }
      case "קשה": { 
        this.boardSe.GetBoardsListHard().snapshotChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          { 
            this.hardBoard.push(collection[i].payload.val()); 
          }
        })
         break;
      }
   }
   value=null;
  }

}
