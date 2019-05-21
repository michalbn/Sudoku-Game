import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { timer } from 'rxjs';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { User } from '../shared/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';


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
  temp:String[][];
  userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
  easyTimes:number=35
  midTimes:number=45
  hardTimes:number=55

  flag=0;

  row:number;
  col:number;

  User: User[];  
  id:string;
  point:number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    public authApi: AuthService, 
    public boardSe : SudokuBoardsService,
    private db: AngularFireDatabase,
    public toastr: ToastrService,  // Toastr service for alert message
    ) { }

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
        //console.log(levelname);
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
        //console.log(difficulty)
        // if(this.flag==0)
        // {
          this.randonBoard(difficulty,levelname)
        // }
        // this.flag=0
        

        
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

  refreshGame()
  {
    clearInterval(this.interval);
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    var levelname = this.route.snapshot.paramMap.get('levelname');
    this.ngOnInit();
  }

  clearBoard()
  {
    //clearInterval(this.interval); 
    console.log(this.userChoice)
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
       var cellId= i.toString()+j.toString();
       var cellChoice=(document.getElementById(cellId) as HTMLInputElement).value
       if(this.sudokoClassic[i][j]==="")
       {
        (document.getElementById(cellId) as HTMLInputElement).value=""
       }
     }
    }
    //this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    //var difficulty = this.route.snapshot.paramMap.get('difficulty');
    //var levelname = this.route.snapshot.paramMap.get('levelname');
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    
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

    console.log(this.userChoice)

  }

  home()
  {
    clearInterval(this.interval);
    this.router.navigate(['/single-game']);//go to new-user
  }

  help()
  {
    if(this.point>=100)
    {
      if( this.find_empty_pos()==true)
      {
        this.point-=100;
        this.db.database.ref("users-list/"+this.id+"/point").set(this.point);
        //console.log(this.row,this.col)
      //  var cellId= this.row.toString()+this.col.toString();
       // (document.getElementById(cellId) as HTMLInputElement).value=(this.temp[this.row][this.col]).toString()
        //(document.getElementById(cellId) as HTMLInputElement).value='5'
        //console.log((document.getElementById(cellId) as HTMLInputElement).value)
        //document.getElementById(cellId).style.backgroundColor="pink";
        
        var difficulty = this.route.snapshot.paramMap.get('difficulty');
        if(difficulty=='קל')
        {
          this.easyTimes=this.easyTimes-1
        }
        if(difficulty=='בינוני')
        {
          this.midTimes=this.midTimes-1
        }
        if(difficulty=='קשה')
        {
          this.hardTimes=this.hardTimes-1
        }
      }
      else
      {
        this.toastr.error('הלוח מלא ולכן לא ניתן להשתמש בעזרה', '!אופס');
      }

    }


    
  }

  find_empty_pos()
  {
    this.scanBoeard()
  for(var i=0; i<9 ; i++)
  {
   for(var j=0; j<9; j++)
   {
      if(this.sudokoClassic[i][j]==""&& this.userChoice[i][j]=="")
      //if(((document.getElementById(i.toString()+j.toString()) as HTMLInputElement).value)!=this.temp[i][j])
      {
        // console.log(this.temp)
        // console.log(this.sudokoClassic)
        // console.log(i,j)
        // console.log(i.toString()+j.toString())
        //JSON.parse(JSON.stringify(this.temp[i][j]));
        
        this.sudokoClassic[i][j]=this.temp[i][j]
     
        
        return true
      }
    }
   }
   return false;
  }

  // backtracking(row,col,counter)
  // {

  // }

  EndGame()
  {
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
      var cellId= i.toString()+j.toString();
      if(((document.getElementById(cellId) as HTMLInputElement).value)!==(this.temp[i][j]).toString())
      {
        var alrt= " יש לך טעות בשורה " + i.toString() + " ובעמודה " + j.toString();
        this.toastr.warning(alrt, ':התראה');
        console.log(this.userChoice)
       // console.log(i,j)
        return false;
      }
     }
    }
    alert("you win");
    //הוספת מידע ל DB
    this.router.navigate(['/single-game']);//go to new-user
    return true;
  }

  randonBoard(difficulty,levelname)
  {
    if(difficulty==="קל")
    {
      this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {
          
          if(collection[i].payload.val().boardName===levelname)
          {
           // console.log(collection[i].payload.val())
            this.temp=collection[i].payload.val().sudoku.slice()
            console.log(this.easyTimes)
            this.createGame(this.easyTimes,collection[i].payload.val().sudoku.slice())
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
            //console.log(collection[i].payload.val())
            this.temp=collection[i].payload.val().sudoku.slice()
            this.createGame(this.midTimes,collection[i].payload.val().sudoku.slice())

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
            //console.log(collection[i].payload.val())
            this.temp=collection[i].payload.val().sudoku.slice()
            this.createGame(this.hardTimes,collection[i].payload.val().sudoku.slice())
            
            break
          }     
        }
        return
      })

    }
  }

  scanBoeard()
  {
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
       var cellId= i.toString()+j.toString();
      
       var cellChoice=(document.getElementById(cellId) as HTMLInputElement).value
       //console.log(cellChoice)
       //console.log(this.sudokoClassic[i][j])
       if(this.sudokoClassic[i][j]==="")
       {
         this.userChoice[i][j]=cellChoice;
       }
       else
       {
         this.userChoice[i][j]="";
       }
       console.log(this.userChoice)
     }
   }

  }
}
