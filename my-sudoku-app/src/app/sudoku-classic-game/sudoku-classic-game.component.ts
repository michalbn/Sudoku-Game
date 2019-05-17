import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { timer } from 'rxjs';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';

@Component({
  selector: 'app-sudoku-classic-game',
  templateUrl: './sudoku-classic-game.component.html',
  styleUrls: ['./sudoku-classic-game.component.css']
})
export class SudokuClassicGameComponent implements OnInit {
  val:number;
  timeLeft: number = 0;
  interval;
  sudokoClassic:String[][];

  constructor(private router: Router,private route: ActivatedRoute,public authApi: AuthService, public boardSe : SudokuBoardsService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      var difficulty = this.route.snapshot.paramMap.get('difficulty');
      var levelname = this.route.snapshot.paramMap.get('levelname');
      if(difficulty==="קל" || difficulty==="בינוני"||difficulty==="קשה")
      {
        console.log(levelname);
        // const source = timer(0,1000);
        // //output: 0,1,2,3,4,5......
        // const subscribe = source.subscribe(val =>{
        //   this.val=val;
        //   console.log(val)
        //   if(this.val==5)
        //   {
        //     //subscribe.unsubscribe()

         
        //   }
        // } );

        //goooodd
        
        // this.interval = setInterval(() => {
        //   if(this.timeLeft < 59) {
        //     this.timeLeft++;
        //   } else {
        //     this.timeLeft = 0;
        //   }
        // },1000)
        if(difficulty==="קל")
        {
          this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
            for (var i = 0; i < collection.length; i++) 
            {
              
              if(collection[i].payload.val().boardName===levelname)
              {
                console.log(collection[i].payload.val())
                this.sudokoClassic=collection[i].payload.val().sudoku.slice()

                var times = 35;
                while(times>0)
                {
                  var random_row= parseInt((Math.random()*10).toString());
                  while(random_row==9)
                  {
                    random_row= parseInt((Math.random()*10).toString());
                  }
                  var random_col= parseInt((Math.random()*10).toString());
                  while(random_col==9)
                  {
                    random_col= parseInt((Math.random()*10).toString());
                  }

                  if(this.sudokoClassic[random_row][random_col]!=="")
                  {
                    this.sudokoClassic[random_row][random_col]=""
                    times--
                  }
                }
                console.log(this.sudokoClassic)

              }
              
            }
          })

        }

        
      }
      else
      {
        this.router.navigate(['/single-game']);//go to new-user
      }

    }

  }
  // onKey(event: any)
  // {
  //   console.log(event)
  // }

  isDisabled(value)
  {
    //console.log(value)
    if(value=="")
    {
      return false
    }
    else
    {
      return true
    }
  
  }

  newGame()
  {
    this.ngOnInit();
  }

}
