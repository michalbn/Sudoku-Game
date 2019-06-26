import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { timer } from 'rxjs';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { User } from '../shared/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-sudoku-classic-game',
  templateUrl: './sudoku-classic-game.component.html',
  styleUrls: ['./sudoku-classic-game.component.css']
})
export class SudokuClassicGameComponent implements OnInit {

  //timer
  val:number;
  sec: number = 0;
  min: number = 0;
  hour: number = 0;
  interval;

  time:number=0;
  interval1;

  public feedbackForm: FormGroup;//feedback form
  grade:Object[]=[];//Save the grade in DB
  winning:number;//score

  sudokoClassic:String[][];//The board with initial numbers
  temp:String[][];//Full board
  userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice

  //Number of empty squares
  easyTimes:number=35;
  midTimes:number=45;
  hardTimes:number=55;

  //Player details
  User: User[];
  id:string;

  
  point:number;//The number of points you earned

  constructor(private router: Router,
    private route: ActivatedRoute,
    public authApi: AuthService, 
    public boardSe : SudokuBoardsService,
    private db: AngularFireDatabase,
    public toastr: ToastrService,  // Toastr service for alert message
    public fb: FormBuilder       // Form Builder service for Reactive forms
    ) { }

  ngOnInit() {
    this.feedbacForm();
    this.grade=[];//init
    if(this.authApi.getSessionStorage()==null)///if session  null
    {
      this.router.navigate(['/']);
    }
    else
    {
      var difficulty = this.route.snapshot.paramMap.get('difficulty');
      var levelname = this.route.snapshot.paramMap.get('levelname');
      if(difficulty==="קל" || difficulty==="בינוני"||difficulty==="קשה")
      {
        let root = document.documentElement;
        root.style.setProperty('--numbersColor',this.authApi.numbersColor)   
        this.boardSe.GetAllBoradsList();  // Call GetAllBoradsList
        let s = this.authApi.GetUsersList(); //list of users
        s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
          this.User = [];
          data.forEach(item => {
            let a = item.payload.toJSON();
            
            if(a["nickName"]===this.authApi.getSessionStorage())
            {
              this.id=item.key ;
              this.authApi.valid=this.id
              this.grade=(item.payload.val().grade).slice()//copy the grade from DB
              a['$key'] = item.key;
              this.User.push(a as User);
              this.point=this.User[0].point;//copy the point from DB
            }
          })
        })

        //init timer
        this.hour=0;
        this.min=0;
        this.sec=0;
        this.interval=0;
        this.timeInterval();
        this.randonBoard(difficulty,levelname);
      }
      else//The difficulty level does not exist
      {
        this.router.navigate(['/single-game']);//go to new-user
      }

    }

  }
  // onKey(event: any)
  // {
  //   console.log(event)
  // }

  feedbacForm()//Terms for entering feedback
  {
    this.feedbackForm= this.fb.group({
      feedback: ['', [Validators.required, ,Validators.maxLength(50)]],
      rate: ['', []]
    })  
  }

  get feedback() {//get user feedback
    return this.feedbackForm.get('feedback');
  }

  get rate() {//get user rate
    return this.feedbackForm.get('rate');
  }

  isDisabled(value)
  //You can not click on a cell that is already full
  {
    if(value=="")
    {
      return false;
    }
    else
    {
      let root = document.documentElement;
      root.style.setProperty('--helpNumbersColor',this.authApi.helpNumbersColor)
      return true;
    }
  }

  refreshGame()//Shuffle the board
  {
    clearInterval(this.interval);
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    this.ngOnInit();
  }

  clearBoard()//clear user choice
  {
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
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    
  }

  createGame(times:number,dbInfo)
  //Randomly fills numbers according to the difficulty level of the board
  {
    this.sudokoClassic=[]
    this.sudokoClassic=dbInfo.slice()
    while(times>0)
    {
      var random_row= parseInt((Math.random()*10).toString());//1-9
      while(random_row==9)
      {
        random_row= parseInt((Math.random()*10).toString());//Place 9 does not exist on the board, there are 8 cells
      }
      var random_col= parseInt((Math.random()*10).toString());//1-9
      while(random_col==9)
      {
        random_col= parseInt((Math.random()*10).toString());//Place 9 does not exist on the board, there are 8 cells
      }

      if(this.sudokoClassic[random_row][random_col]!=="")//Put in an empty data
      {
        this.sudokoClassic[random_row][random_col]=""
        times--
      }
    }
  }

  home()
  {
    clearInterval(this.interval);
    var r = confirm("לצאת מהמשחק?");
    if (r == true) //exit
    {
      
      this.router.navigate(['/single-game']);//go to single-game
    }
    else
    { 
      this.timeInterval()
    }  
  }

  help()
  {
    this.scanBoeard();//fill user choice
    if(this.point>=100)
    {
      if(this.find_empty_pos()==true)//Finding an empty cell in the board
      {
        this.point-=100;
        this.db.database.ref("users-list/"+this.id+"/point").set(this.point);//Update the number of points in DB
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
    else//Not enough points
    {
      this.toastr.info('אין לך מספיק נקודות');
    }    
  }

  find_empty_pos()
  {
  this.scanBoeard()//fill user choice
  for(var i=0; i<9 ; i++)
  {
   for(var j=0; j<9; j++)
   {
      if(this.sudokoClassic[i][j]==""&& this.userChoice[i][j]=="")
      {
        //We found an empty cell and filled it up
        this.sudokoClassic[i][j]=this.temp[i][j]    
        return true
      }
    }
   }
   return false;
  }

  EndGame()
  {
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
      var cellId= i.toString()+j.toString();
      //Checking errors in the table
      if(((document.getElementById(cellId) as HTMLInputElement).value)!==(this.temp[i][j]).toString())
      {
        var alrt= " יש לך טעות בשורה " + (i+1).toString() + " ובעמודה " + (j+1).toString();
        this.toastr.warning(alrt, ':התראה');
        document.getElementById(cellId).style.backgroundColor='yellow';
        document.getElementById(cellId).style.borderRadius='50%'
        setTimeout(function(){
          document.getElementById(cellId).style.backgroundColor = 'white';  // Change the color back to the original
        }, 600);
        return false;
      }
     }
    }
    //If there is no error in the board
    clearInterval(this.interval);//Stop the timer
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    var levelname = this.route.snapshot.paramMap.get('levelname');
    this.winning=this.boardSe.calculatePoints(difficulty,this.sec,this.min)//Calculate points
    if(this.grade[0]["boardName"]=="")//If there are no grades in DB
    {
      this.grade=[{boardName:levelname,difficulty:difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()}];
      this.db.database.ref("users-list/"+this.id+"/grade").set(this.grade);  
    }
    else
    {
      for(var i=0 ; i<this.grade.length ; i++)
      {
        if(this.grade[i]["boardName"]===levelname && this.grade[i]["difficulty"] ===difficulty )
        {
          if(this.winning===this.grade[i]["score"])//If I win the same number of points
          {
            this.grade.splice(i, 1);//Take out the previous one
            this.grade.push({boardName:levelname,difficulty:difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()});
            this.winning=0;
            break;

          }
          else if(this.winning>this.grade[i]["score"])//If I win more points
          {
            var temp = this.grade[i]["score"]
            this.grade.splice(i, 1);//Take out the previous one
            this.grade.push({boardName:levelname,difficulty:difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()});
            this.winning-=temp;  
            break;    
          }
          else//If I win less points
          {
            this.winning=0;
            break;
          }
        }
        else if(i==this.grade.length-1)//Adding new grades to DB
        {
          this.grade.push({boardName:levelname,difficulty:difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()}); 
          break;
        }
      }
      this.db.database.ref("users-list/"+this.id+"/grade").set(this.grade);  
    }
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    this.point+=this.winning;
    this.db.database.ref("users-list/"+this.id+"/point").set(this.point);
    return true;
  }

  randonBoard(difficulty,levelname)
  //Randomly fills numbers according to the difficulty level of the board
  {
    if(difficulty==="קל")
    {
      this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {   
          if(collection[i].payload.val().boardName===levelname)
          { 
            this.temp=collection[i].payload.val().sudoku.slice()
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
            this.temp=collection[i].payload.val().sudoku.slice()
            this.createGame(this.hardTimes,collection[i].payload.val().sudoku.slice()) 
            break
          }     
        }
        return
      })
    }
  }

  scanBoeard()//Saving the player's selections
  {
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
       var cellId= i.toString()+j.toString();
      
       var cellChoice=(document.getElementById(cellId) as HTMLInputElement).value
       if(this.sudokoClassic[i][j]==="")
       {
         this.userChoice[i][j]=cellChoice;
       }
       else
       {
         this.userChoice[i][j]="";
       }
     }
   }
  }


  close_box()//If the player has not registered feedback
  {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.interval1=0;
    this.interval1 = setInterval(() => {
      if(this.time===3)
      {
        clearInterval(this.interval1);
        this.router.navigate(['/single-game']);//single-game
      }
      else
      {
        this.time++;
      }
    },100)
  }

  timeInterval()//set timer
  {
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
  }


  save_feedback()//Save feedback in DB
  {
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    var levelname = this.route.snapshot.paramMap.get('levelname');
    if(difficulty==="קל")
    {
      this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().boardName===levelname)
          {
            var boardId=collection[i].payload.key;
            var feedbackData=(collection[i].payload.val().feedback).slice();
            var rateData=(collection[i].payload.val().rate);
            if(this.feedbackForm.value.feedback!=="")//If the player wrote feedback
            {     
              if(feedbackData[0].player==="")//If there is still no feedback in the DB
              {
                rateData.vote=1;
                if(this.feedbackForm.value.rate=="")//If the player has not rated the game
                {
                  rateData.rating=0;//Considered to have given the score 0
                }
                else
                {
                  rateData.rating=parseInt(this.feedbackForm.value.rate);
                }
              feedbackData[0].player=this.authApi.getSessionStorage();
              feedbackData[0].playerFeedback=this.feedbackForm.value.feedback;
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/feedback").set(feedbackData);  
              this.feedbackForm.value.feedback="";
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
            else//If there are already any feedbacks in DB
            {
              rateData.vote+=1;
              if(this.feedbackForm.value.rate=="")//If the player has not rated the game
              {
                rateData.rating=((rateData.rating)/2).toFixed(2);//Considered to have given the score 0
              }
              else
              {
                rateData.rating=((rateData.rating+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
                //until 2 decimal places
              }
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/feedback").set(feedbackData);
              this.feedbackForm.value.feedback="" ;
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
          }
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
          var boardId=collection[i].payload.key
          var feedbackData=(collection[i].payload.val().feedback).slice();
          var rateData=(collection[i].payload.val().rate);
          if(this.feedbackForm.value.feedback!=="")
          {    
            if(feedbackData[0].player==="")
            {
              rateData.vote=1;
              if(this.feedbackForm.value.rate=="")
              {
                rateData.rating=0;
              }
              else
              {
                rateData.rating=parseInt(this.feedbackForm.value.rate);
              }   
              feedbackData[0].player=this.authApi.getSessionStorage();
              feedbackData[0].playerFeedback=this.feedbackForm.value.feedback;
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/feedback").set(feedbackData);
              this.feedbackForm.value.feedback="";
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
            else
            {
              rateData.vote+=1;
              if(this.feedbackForm.value.rate=="")
              {
                rateData.rating=((rateData.rating)/2).toFixed(2);
              }
              else
              {
                rateData.rating=((rateData.rating+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
              }
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/feedback").set(feedbackData);
              this.feedbackForm.value.feedback="" ;
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
          } 
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
          var boardId=collection[i].payload.key
          var feedbackData=(collection[i].payload.val().feedback).slice();
          var rateData=(collection[i].payload.val().rate);
          if(this.feedbackForm.value.feedback!=="")
          {    
            if(feedbackData[0].player==="")
            {
              rateData.vote=1;
              if(this.feedbackForm.value.rate=="")
              {
                rateData.rating=0;
              }
              else
              {
                rateData.rating=parseInt(this.feedbackForm.value.rate);
              }
              
              feedbackData[0].player=this.authApi.getSessionStorage();
              feedbackData[0].playerFeedback=this.feedbackForm.value.feedback;

              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/feedback").set(feedbackData);
              this.feedbackForm.value.feedback="";
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
            else
            {
              rateData.vote+=1;
              if(this.feedbackForm.value.rate=="")
              {
                rateData.rating=((rateData.rating)/2).toFixed(2);
              }
              else
              {
                rateData.rating=((rateData.rating+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
              }
              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/feedback").set(feedbackData);
              this.feedbackForm.value.feedback="";
              this.feedbackForm.value.rate="";
              i=collection.length;
            }
          }           
        }      
      }
      return
    })
  }
  this.router.navigate(['/single-game']);//go to single-game
  }

}
