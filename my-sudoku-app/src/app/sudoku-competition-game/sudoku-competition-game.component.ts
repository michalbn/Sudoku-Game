import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CompetitionService } from '../shared/competition.service';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { Competition } from '../shared/Competition';
import { User } from '../shared/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-sudoku-competition-game',
  templateUrl: './sudoku-competition-game.component.html',
  styleUrls: ['./sudoku-competition-game.component.css']
})
export class SudokuCompetitionGameComponent implements OnInit {

  from: string;
  to:string;
  difficulty:string;
  boradName:string;
  sudokuBoard:string[][];
  temp:string[][];
  chat;
  gameId;

  sec: number = 0;
  min: number = 0;
  hour: number = 0;
  interval;

  details:Competition

  //Number of empty squares
  easyTimes:number=35;
  midTimes:number=45;
  hardTimes:number=55;

  flag=0

  dbDtails:string[]=[]
  userChoice:string[][]=[]

  User: User[];
  id:string;

  public feedbackForm: FormGroup;//feedback form
  gradeCompetition:Object[]=[];//Save the grade in DB
  winning:number;//score
  point:number;//The number of points you earned

  winner:string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    public authApi: AuthService,
    public competitionSe: CompetitionService,
    public boardSe : SudokuBoardsService,
    private db: AngularFireDatabase,
    public toastr: ToastrService,
    public fb: FormBuilder,
    private af: AngularFireDatabase
    ) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session  null
    {
      this.router.navigate(['/']);
    }
    else
    {
      var path =  this.router.url.substr(1,this.router.url.indexOf('/',1))
      if(path=="competition-game/")
      {
        this.feedbacForm();
        this.details=null
        this.gameId=null;
        this.winner=""
        this.gradeCompetition=[];//init
        this.flag =0;
        this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.temp= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.from = this.route.snapshot.paramMap.get('from')
        this.to = this.route.snapshot.paramMap.get('to')
        this.difficulty = this.route.snapshot.paramMap.get('difficulty')
        this.boradName = this.route.snapshot.paramMap.get('levelname')
        this.sudokuBoard= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.chat=""
        var modal2 = document.getElementById("myModal2");
        if(modal2!=null)
        {
          modal2.style.display = "none";
        }
        var modal1 = document.getElementById("myModal1");
        if(modal1!=null)
        {
          modal1.style.display = "none";
        }
        if(this.difficulty==="קל" || this.difficulty==="בינוני"||this.difficulty==="קשה")
        {
          let root = document.documentElement;
          root.style.setProperty('--numbersColor',this.authApi.getSessionColornumbersColor())     
          this.authApi.GetUsersList().snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
            this.User = [];
            data.forEach(item => {
              let a = item.payload.toJSON();
              
              if(a["nickName"]===this.authApi.getSessionStorage())
              {
                this.id=item.key ;
                this.authApi.valid=this.id
                this.gradeCompetition=(item.payload.val().gradeCompetition).slice()//copy the grade from DB
                a['$key'] = item.key;
                this.User.push(a as User);
                this.point=this.User[0].point;//copy the point from DB
              }
            })
          })


          this.hour=0;
          this.min=0;
          this.sec=0;
          this.interval=0;
          this.randonBoard();
          console.log(this.sudokuBoard)

          this.competitionSe.GetAllCompetitioncList().snapshotChanges().subscribe(collection => {
            var path =  this.router.url.substr(1,this.router.url.indexOf('/',1))
            if(path=="competition-game/")
            {
              console.log(this.details)
              if(collection.length===0 && this.from===this.authApi.getSessionStorage()&& this.details!==null )
              {
                this.competitionSe.AddCompetition(this.details)
                this.flag=1
                this.details=null
              }
              else if( collection.length!==0 )
              {
                for(var i=0;i<collection.length;i++)
                {
                  if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to && this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName)
                  {
                    this.flag=1;
                    break;
                  }
                }
                if(this.flag===0 && this.details!=null)
                {
                  this.competitionSe.AddCompetition(this.details)
                  this.details=null
                  return;
    
                }
                else
                {
                  this.flag=0;
                  return;
                }
              }

            }
            return;
          })
          this.competitionSe.GetAllCompetitioncList().snapshotChanges().subscribe(collection => {
            
            for (var i = 0; i < collection.length; i++) 
            {
              if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to &&
               this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName
               && collection[i].payload.val().done==="no" && collection[i].payload.val().win==="")
              {
                console.log("1")
                this.gameId=collection[i].key
                this.dbDtails=[]
                this.dbDtails.push(collection[i].payload.val());
                this.sudokuBoard=this.dbDtails[0]["sudokuBoard"].slice()
                console.log(this.sudokuBoard)
                break;
              }
              else if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to &&
              this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName
              && collection[i].payload.val().done==="yes" && collection[i].payload.val().win!=="")
              {
                console.log("2")
                console.log("some one win")
                this.winner=collection[i].payload.val().win
                console.log(this.gameId)
                console.log(collection[i].payload.val())
                this.winGame(collection[i].payload.val().win)
                break;
              }
              else
              {
                console.log("3")
                break;
              }
            }
            console.log(this.dbDtails)
            return;
  
          })
          this.timeInterval();
          

          
        }
        else
        {
          this.router.navigate(['/home-page']);
        }

       
      }
    }
  }


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
            this.router.navigate(['/home-page']);//go to new-user
          }
         
        }
      }
    },1000)
  }


  randonBoard()
  {
    if(this.difficulty==="קל")
    {
      this.boardSe.GetBoardsList_CompetitionEasy().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {   
          if(collection[i].payload.val().boardName===this.boradName)
          { 
            this.temp=collection[i].payload.val().sudoku.slice()
            this.createGame(this.easyTimes,collection[i].payload.val().sudoku.slice())
            break
          }     
        }
        return
      })
     }
     if(this.difficulty==="בינוני")
     {
       this.boardSe.GetBoardsList_CompetitionMedium().snapshotChanges().subscribe(collection => {
         for (var i = 0; i < collection.length; i++) 
         {    
           if(collection[i].payload.val().boardName===this.boradName)
           {
             this.createGame(this.midTimes,collection[i].payload.val().sudoku.slice())
             break
           }     
         }
         return
       })
     }
     if(this.difficulty==="קשה")
     {
       this.boardSe.GetBoardsList_CompetitionHard().snapshotChanges().subscribe(collection => {
         for (var i = 0; i < collection.length; i++) 
         {
           if(collection[i].payload.val().boardName===this.boradName)
           {
             this.createGame(this.hardTimes,collection[i].payload.val().sudoku.slice()) 
             break
           }     
         }
         return
       })
     }
  }

  createGame(times:number,dbInfo)
  //Randomly fills numbers according to the difficulty level of the board
  {
    // this.sudokoClassic=[]
    this.sudokuBoard= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
    this.sudokuBoard=dbInfo.slice()
    console.log(this.sudokuBoard)
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

      if(this.sudokuBoard[random_row][random_col]!=="")//Put in an empty data
      {
        this.sudokuBoard[random_row][random_col]=""
        times--
      }
    }
    this.details=null
    this.details={
      from:this.from,
      to:this.to,
      difficulty:this.difficulty,
      boradName:this.boradName,
      chat:[{name:"",massage:""}],
      sudokuBoard:this.sudokuBoard,
      done:"no",
    win:""}
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
      root.style.setProperty('--helpNumbersColor',this.authApi.getSessionColorhelpNumbersColor())
      return true;
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
       if(this.sudokuBoard[i][j]==="")
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
      if(this.sudokuBoard[i][j]==""&& this.userChoice[i][j]=="")
      {
        //We found an empty cell and filled it up
        this.sudokuBoard[i][j]=this.temp[i][j]    
        return true
      }
    }
   }
   return false;
  }

  clearBoard()//clear user choice
  {
    for(var i=0; i<9 ; i++)
    {
     for(var j=0; j<9; j++)
     {
       var cellId= i.toString()+j.toString();
       var cellChoice=(document.getElementById(cellId) as HTMLInputElement).value
       if(this.sudokuBoard[i][j]==="")
       {
        (document.getElementById(cellId) as HTMLInputElement).value=""
       }
     }
    }
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    
  }

  home()
  {
    clearInterval(this.interval);
    var r = confirm("לצאת מהמשחק?");
    if (r == true) //exit
    {
      console.log(this.gameId)
      this.db.database.ref("competition-game/"+this.gameId+"/done").set("yes");
      if(this.authApi.getSessionStorage()===this.from)
      {
        this.db.database.ref("competition-game/"+this.gameId+"/win").set(this.to);
      }
      if(this.authApi.getSessionStorage()===this.to)
      {
        this.db.database.ref("competition-game/"+this.gameId+"/win").set(this.from);
      }
    }
    else
    { 
      console.log(this.gameId)
      this.timeInterval()
    }  
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
    console.log("yesssssssssssssssssssssss")
    this.db.database.ref("competition-game/"+this.gameId+"/done").set("yes");
    this.db.database.ref("competition-game/"+this.gameId+"/win").set(this.authApi.getSessionStorage());
   // this.winning=this.boardSe.calculatePoints(this.difficulty,this.sec,this.min)//Calculate points

  }

  openForm()
  {
    var openf=document.getElementById("myForm")
    if(openf!=null)
    {
      openf.style.display = "block";
    } 
  }

  closeForm()
   {
     var closef=document.getElementById("myForm")
     if(closef!=null)
     {
       closef.style.display = "none";
     }    
  }

  addMsg()
  {
   this.dbDtails[0]["chat"].push({name:this.authApi.getSessionStorage(),massage:(document.getElementById("textarea") as HTMLInputElement).value})
   this.dbDtails[0]["chat"];
   (document.getElementById("textarea") as HTMLInputElement).value="";
    this.db.database.ref("competition-game/"+this.gameId+"/chat").set(this.dbDtails[0]["chat"]);

  }

  winGame(theWinner)
  {
    this.closeForm()
    if(theWinner!=null)
    {
      clearInterval(this.interval);//Stop the timer
      console.log("whyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
      if(this.authApi.getSessionStorage()===theWinner && this.gameId!=null)
      {
        this.winning=this.competitionSe.calculatePoints(this.difficulty,this.sec,this.min)
        console.log(this.gradeCompetition[0]["boardName"])
        if(this.gradeCompetition[0]["boardName"]=="")//If there are no grades in DB
        {
          this.gradeCompetition=[{boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),rival:this.to}];
          this.db.database.ref("users-list/"+this.id+"/gradeCompetition").set(this.gradeCompetition);  
        }
        else
        {
          for(var i=0 ; i<this.gradeCompetition.length ; i++)
          {
            if(this.gradeCompetition[i]["boardName"]===this.boradName && this.gradeCompetition[i]["difficulty"] ===this.difficulty && this.gradeCompetition[i]["rival"]=== this.to)
            {
              if(this.winning===this.gradeCompetition[i]["score"])//If I win the same number of points
              {
                this.gradeCompetition.splice(i, 1);//Take out the previous one
                this.gradeCompetition.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),rival:this.to});
                this.winning=0;
                break;
              }
              else if(this.winning>this.gradeCompetition[i]["score"])//If I win more points
              {
                var temp = this.gradeCompetition[i]["score"]
                this.gradeCompetition.splice(i, 1);//Take out the previous one
                this.gradeCompetition.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),rival:this.to});
                this.winning-=temp;  
                break;    
              }
              else//If I win less points
              {
                this.winning=0;
                break;
              }
            }
            else if(i==this.gradeCompetition.length-1)//Adding new grades to DB
            {
              this.gradeCompetition.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),rival:this.to}); 
              break;
            }
          }
          this.db.database.ref("users-list/"+this.id+"/gradeCompetition").set(this.gradeCompetition);         
        }
        var modal2 = document.getElementById("myModal2");
        if(modal2!=null)
        {
          console.log("4")
          modal2.style.display = "block";
          this.point+=this.winning;
         
        }
        this.db.database.ref("users-list/"+this.id+"/point").set(this.point);
      }
      else
      {
        var modal1 = document.getElementById("myModal1");
        if(modal1!=null)
        {
          modal1.style.display = "block";
        }
        console.log("5")
      }
  
      theWinner=null;
      return;
    }    
  }

  close_box()//If the player has not registered feedback and win
  {
    var modal2 = document.getElementById("myModal2");
    console.log(modal2)
    if(modal2!=null)
    {
      modal2.style.display = "none";
      this.competitionSe.DeleteCompetitione(this.gameId)
     
    }
    this.router.navigate(['/home-page']);

  }

  close_box1()//If the player has not registered feedback
  {
    var modal1 = document.getElementById("myModal1");
    console.log(modal1)
    if(modal1!=null)
    {
      modal1.style.display = "none";
      
    }
    this.router.navigate(['/home-page']);
  }


  save_feedback()//Save feedback in DB
  {

    this.closeForm()
    console.log("saveeeeeee")
    if(this.difficulty==="קל")
    {
      this.boardSe.GetBoardsList_CompetitionEasy().snapshotChanges().subscribe(collection => {
        for (var i = 0; i < collection.length; i++) 
        {
          if(collection[i].payload.val().boardName===this.boradName)
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
              this.db.database.ref("sudoku-boards/competition/easy/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/competition/easy/"+boardId+"/feedback").set(feedbackData);  
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
                rateData.rating=((parseInt(rateData.rating)+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
                //until 2 decimal places
              }
              this.db.database.ref("sudoku-boards/competition/easy/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/competition/easy/"+boardId+"/feedback").set(feedbackData);
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
  if(this.difficulty==="בינוני")
  {
    this.boardSe.GetBoardsList_CompetitionMedium().snapshotChanges().subscribe(collection => {
      for (var i = 0; i < collection.length; i++) 
      {
        if(collection[i].payload.val().boardName===this.boradName)
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
              this.db.database.ref("sudoku-boards/competition/medium/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/competition/medium/"+boardId+"/feedback").set(feedbackData);
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
                rateData.rating=((parseInt(rateData.rating)+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
              }
              this.db.database.ref("sudoku-boards/competition/medium/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/competition/medium/"+boardId+"/feedback").set(feedbackData);
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
  if(this.difficulty==="קשה")
  {
    this.boardSe.GetBoardsList_CompetitionHard().snapshotChanges().subscribe(collection => {
      for (var i = 0; i < collection.length; i++) 
      {
        if(collection[i].payload.val().boardName===this.boradName)
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

              this.db.database.ref("sudoku-boards/competition/hard/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/competition/hard/"+boardId+"/feedback").set(feedbackData);
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
                rateData.rating=((parseInt(rateData.rating)+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
              }
              this.db.database.ref("sudoku-boards/competition/hard/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/competition/hard/"+boardId+"/feedback").set(feedbackData);
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
  if(this.winner===this.authApi.getSessionStorage())
  {
    this.close_box()
  }
  else
  {
    this.close_box1()
  }
 
 
 // this.router.navigate(['/home-page']);//go to single-game
 }

  




}
