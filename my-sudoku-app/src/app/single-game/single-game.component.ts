import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {
  easyBoard: string[]=[];//My friend list - status approved
  mediumBoard: string[]=[];//My friend list - status approved
  hardBoard: string[]=[];//My friend list - status approved

  constructor(private router: Router,public boardSe : SudokuBoardsService) { }

  ngOnInit() {
    //document.getElementById("demo").style.color="black"
  }

  play()
  {
    this.router.navigate(['/classic-game']);//go to new-user
  }

  mark(levelName)
  {
    if(document.getElementById(levelName).style.color=="blue")
      document.getElementById(levelName).style.color="black";
    else
    {
      document.getElementById(levelName).style.color="blue";
    }
    levelName=null;
  }
  modo(value: string)
  {
    console.log(value)
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
