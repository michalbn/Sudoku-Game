import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { timer } from 'rxjs';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { User } from '../shared/user';


@Component({
  selector: 'app-sudoku-classic-game',
  templateUrl: './sudoku-classic-game.component.html',
  styleUrls: ['./sudoku-classic-game.component.css']
})
export class SudokuClassicGameComponent implements OnInit {
  val:number;
  sec: number = 0;
  min: number = 0;
  hour: number = 0;
  interval;
  sudokoClassic:String[][];

  User: User[];  
id:string;
point:number;

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
        this.boardSe.GetAllBoradsList();  // Call GetAllBoradsList before main form is being called
        let s = this.authApi.GetUsersList(); //list of users
        s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
          this.User = [];
          data.forEach(item => {
            let a = item.payload.toJSON();
            
            if(a["nickName"]===this.authApi.getSessionStorage())
            {
              this.id=item.key ;
              a['$key'] = item.key;
              this.User.push(a as User);
              this.point=this.User[0].point;
            }
          })
        })
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
        this.hour=0;
        this.min=0;
        this.sec=0;
        this.interval=0;
        this.interval = setInterval(() => {
          if(this.sec < 59) {
            this.sec++;
          } 
          else
          {
            this.sec = 0;
            if(this.min<59)
            {
              this.min++;
            }
            else
            {
              this.min=0;
              if(this.hour<23)
              {
                this.hour++;
              }
              else{
                clearInterval(this.interval);
                this.router.navigate(['/single-game']);//go to new-user
                
                
             
              }
             
            }
          }
        },1000)
        console.log(difficulty)
        if(difficulty==="קל")
        {
          this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
            for (var i = 0; i < collection.length; i++) 
            {
              
              if(collection[i].payload.val().boardName===levelname)
              {
                var times = 35;
                console.log(collection[i].payload.val())
                this.createGame(times,collection[i].payload.val().sudoku)
                break
              }     
            }
            return
          })

        }
        if(difficulty==="בינוני")
        {
          this.boardSe.GetBoardsListMedium().snapshotChanges().subscribe(collection => {
            for (var i = 0; i < collection.length; i++) 
            {
              
              if(collection[i].payload.val().boardName===levelname)
              {
                var times = 45;
                console.log(collection[i].payload.val())
                this.createGame(times,collection[i].payload.val().sudoku)

                break
              }     
            }
            return
          })

        }
        if(difficulty==="קשה")
        {
          this.boardSe.GetBoardsListHard().snapshotChanges().subscribe(collection => {
            for (var i = 0; i < collection.length; i++) 
            {
              
              if(collection[i].payload.val().boardName===levelname)
              {
                var times =55;
                console.log(collection[i].payload.val())
                this.createGame(times,collection[i].payload.val().sudoku)
                
                break
              }     
            }
            return
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
    clearInterval(this.interval);
    this.ngOnInit();
  }

  createGame(times:number,dbInfo)
  {
    this.sudokoClassic=[]
    this.sudokoClassic=dbInfo.slice()
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

  home()
  {
    clearInterval(this.interval);
    this.router.navigate(['/single-game']);//go to new-user
  }

  help()
  {
    
  }

}
