import { Component, OnInit } from '@angular/core';
import { Collaboration } from '../shared/Collaboration';
import { User } from '../shared/user';
import { FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CompetitionService } from '../shared/competition.service';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { CollaborationService } from '../shared/collaboration.service';

@Component({
  selector: 'app-sudoku-collaboration-game',
  templateUrl: './sudoku-collaboration-game.component.html',
  styleUrls: ['./sudoku-collaboration-game.component.css']
})
export class SudokuCollaborationGameComponent implements OnInit {

  //doard details
  from: string;
  to:string;
  difficulty:string;
  boradName:string;
  sudokuBoard:string[][];
  temp:string[][];
  chat;
  gameId;

//timer
  sec: number = 0;
  min: number = 0;
  hour: number = 0;
  interval;

  details:Collaboration

  //Number of empty squares
  easyTimes:number=35;
  midTimes:number=45;
  hardTimes:number=55;

  flag=0;//if alerdy exsist in db
  flagChangeBoard=0

  //boards
  dbDtails:string[]=[]
  userChoice:string[][]=[]

  User: User[];
  id:string;

  public feedbackForm: FormGroup;//feedback form
  gradeCollaboration:Object[]=[];//Save the grade in DB
  winning:number;//score
  point:number;//The number of points you earned

  constructor(private router: Router,
    private route: ActivatedRoute,
    public authApi: AuthService,
    public collaborationSe:CollaborationService,
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
      if(path=="collaboration-game/")
      {
        //init
        this.feedbackForm=null;
        this.feedbacForm();
        this.flagChangeBoard=0;
        this.details=null
        this.gameId=null;
        this.gradeCollaboration=[];//init
        this.flag =0;
        this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.temp= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.from = this.route.snapshot.paramMap.get('from')
        this.to = this.route.snapshot.paramMap.get('to')
        this.difficulty = this.route.snapshot.paramMap.get('difficulty')
        this.boradName = this.route.snapshot.paramMap.get('levelname')
        this.sudokuBoard= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
        this.chat=""
        if(this.difficulty==="קל" || this.difficulty==="בינוני"||this.difficulty==="קשה")
        {
          let root = document.documentElement;//change color - setting
          root.style.setProperty('--numbersColor',this.authApi.getSessionColornumbersColor())     
          this.authApi.GetUsersList().snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
            this.User = [];
            data.forEach(item => {
              let a = item.payload.toJSON();
              
              if(a["nickName"]===this.authApi.getSessionStorage())
              {
                this.id=item.key ;//user id
                this.authApi.valid=this.id
                this.gradeCollaboration=(item.payload.val().gradeCollaboration).slice()//copy the grade from DB
                a['$key'] = item.key;
                this.User.push(a as User);//my user
                this.point=this.User[0].point;//copy the point from DB
              }
            })
          })
          //init timer
          this.hour=0;
          this.min=0;
          this.sec=0;
          this.interval=0;
          this.randonBoard()

          this.collaborationSe.GetAllCollaborationList().snapshotChanges().subscribe(collection => {
            var path =  this.router.url.substr(1,this.router.url.indexOf('/',1))
            if(path=="collaboration-game/")
            {
              //init variables
              var path1 = this.router.url.substr(("/collaboration-game/").length,this.router.url.indexOf('/Level'))
              var path2=decodeURI(path1)
              var re = /[.,\/-]/
                var nameList = path2.split(re);
                this.from = nameList[1];
                this.to = nameList[2];
                this.difficulty = nameList[3];
                this.boradName = nameList[4];

              //if db empty
              if(collection.length===0 && this.from===this.authApi.getSessionStorage()&& this.details!==null )
              {
                this.collaborationSe.AddCollaboration(this.details)//add game
                this.details=null
              }
              //if db not empty
              else if( this.from===this.authApi.getSessionStorage() && collection.length!==0 && this.flagChangeBoard===0)
              {
                for(var i=0;i<collection.length;i++)
                {
                  //If this game already exists
                  if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to && this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName)
                  {
                    
                    break;
                  }
                }
                //If this game not exists
                if(i===collection.length)
                {
                  this.collaborationSe.AddCollaboration(this.details)
                  this.details=null
                  return;
                }
                else
                {
                  return;
                }
              }
            }
            return;
          })
          this.collaborationSe.GetAllCollaborationList().snapshotChanges().subscribe(collection => {
            for (var i = 0; i < collection.length; i++) 
            {
              if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to &&
              this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName
              && collection[i].payload.val().done==="no" && collection[i].payload.val().win==="")
             {
               //take detail from db - start game
               this.gameId=collection[i].key
               this.dbDtails=[]
               this.dbDtails.push(collection[i].payload.val());
               this.sudokuBoard=this.dbDtails[0]["sudokuBoard"].slice()
               this.userChoice=this.dbDtails[0]["shareBoard"].slice()
               break;
             }
             else if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to &&
             this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName
             && collection[i].payload.val().done==="yes" && collection[i].payload.val().win==="")
             {
               //someone exit from the game
               //console.log("someone exit from the game")
               clearInterval(this.interval);
               this.exitGame()
               break;
             }
             else if(this.from===collection[i].payload.val().from && this.to===collection[i].payload.val().to &&
             this.difficulty===collection[i].payload.val().difficulty && this.boradName===collection[i].payload.val().boradName
             && collection[i].payload.val().done==="yes" && collection[i].payload.val().win!=="")
             {
               //if someone win
                this.winGame()
                break
             }
            }
            return;
          })
          this.timeInterval();//start timer
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
      feedback: ['', [Validators.required, ,Validators.maxLength(100)]],
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

  randonBoard()//create random board each game
  {
    if(this.difficulty==="קל")
    {
      this.boardSe.GetBoardsList_CollaborationEasy().snapshotChanges().subscribe(collection => {
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
       this.boardSe.GetBoardsList_CollaborationMedium().snapshotChanges().subscribe(collection => {
         for (var i = 0; i < collection.length; i++) 
         {    
           if(collection[i].payload.val().boardName===this.boradName)
           {
            this.temp=collection[i].payload.val().sudoku.slice()
             this.createGame(this.midTimes,collection[i].payload.val().sudoku.slice())
             break
           }     
         }
         return
       })
     }
     if(this.difficulty==="קשה")
     {
       this.boardSe.GetBoardsList_CollaborationHard().snapshotChanges().subscribe(collection => {
         for (var i = 0; i < collection.length; i++) 
         {
           if(collection[i].payload.val().boardName===this.boradName)
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

  createGame(times:number,dbInfo)
  //Randomly fills numbers according to the difficulty level of the board
  {
    // this.sudokoClassic=[]
    this.sudokuBoard= new Array(9).fill("").map(() => new Array(9).fill(""));//user choice
    this.sudokuBoard=dbInfo.slice()
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
    //init - insert data to db
    this.details=null
    this.details={
      from:this.from,
      to:this.to,
      difficulty:this.difficulty,
      boradName:this.boradName,
      chat:[{name:"",massage:""}],
      sudokuBoard:this.sudokuBoard,
      shareBoard:this.userChoice,
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

  onKey(event: any,row,col)
  //If one of the players recorded a number
  {
    if(event!=null)
    {
      this.flagChangeBoard=1;
      var cellId= row.toString()+col.toString();
      var cellChoice=(document.getElementById(cellId) as HTMLInputElement).value;
      if(event.key==="Backspace" && cellChoice=="")
      {
        this.db.database.ref("collaboration-game/"+this.gameId+"/shareBoard/"+row+"/"+col).set("");
      }
      else if(cellChoice!=="")
      {
        this.db.database.ref("collaboration-game/"+this.gameId+"/shareBoard/"+row+"/"+col).set(cellChoice);
      }
    }
  }


  openForm()//open chat
  {
    var openf=document.getElementById("myForm")
    if(openf!=null)
    {
      openf.style.display = "block";
    } 
  }

  closeForm()//close chat
   {
     var closef=document.getElementById("myForm")
     if(closef!=null)
     {
       closef.style.display = "none";
     }    
  }

  addMsg()//add message to the chat
  {
   this.dbDtails[0]["chat"].push({name:this.authApi.getSessionStorage(),massage:(document.getElementById("textarea") as HTMLInputElement).value})
   this.dbDtails[0]["chat"];
   (document.getElementById("textarea") as HTMLInputElement).value="";
    this.db.database.ref("collaboration-game/"+this.gameId+"/chat").set(this.dbDtails[0]["chat"]);

  }

  clearBoard()//clear user choice
  {
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
    this.db.database.ref("collaboration-game/"+this.gameId+"/shareBoard").set(this.userChoice);   
  }

  help()//Press the Help button
  {
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

  find_empty_pos()//find empty pos for the help button
  {
    for(var i=0; i<9 ; i++)
    {
      for(var j=0; j<9; j++)
      {
        if(this.sudokuBoard[i][j]==""&& this.userChoice[i][j]=="")
        {
          this.db.database.ref("collaboration-game/"+this.gameId+"/sudokuBoard/"+i+"/"+j).set(this.temp[i][j]);     
          return true
        }
      }
    }
    return false;
  }

  home()//exit button
  {
    // clearInterval(this.interval);
    var r = confirm("לצאת מהמשחק?");
    if (r == true) //exit
    {
      this.db.database.ref("collaboration-game/"+this.gameId+"/done").set("yes");
    }
    else
    { 
      this.timeInterval()
    } 

  }

  exitGame()//technical loss
  {
    this.closeForm()
    var modal3 = document.getElementById("myModal3");
    if(modal3!=null)
    {
      modal3.style.display = "block";
    }

  }

  close_box3()//technical loss -close_box
  {
    var modal3 = document.getElementById("myModal3");
    if(modal3!=null)
    {
      modal3.style.display = "none";
      if(this.from===this.authApi.getSessionStorage())
      {
        this.collaborationSe.DeleteCollaboration(this.gameId)
        this.flagChangeBoard=0;
      }
    }
    this.router.navigate(['/home-page']);
  }

  EndGame()//Clicking the Done button
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
    this.db.database.ref("collaboration-game/"+this.gameId+"/done").set("yes");
    this.db.database.ref("collaboration-game/"+this.gameId+"/win").set(this.authApi.getSessionStorage());

  }

  winGame()
  {
    this.closeForm()
    this.flagChangeBoard=0
    clearInterval(this.interval);//Stop the timer
    this.winning=this.collaborationSe.calculatePoints(this.difficulty,this.sec,this.min)
    if(this.gradeCollaboration[0]["boardName"]=="")//If there are no grades in DB
    {
      if(this.from===this.authApi.getSessionStorage())
      {
        //add garede to the db
        this.gradeCollaboration=[{boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.to}];
        this.db.database.ref("users-list/"+this.id+"/gradeCollaboration").set(this.gradeCollaboration);    
      }
      else if(this.to===this.authApi.getSessionStorage())
      {
        //add garede to the db
        this.gradeCollaboration=[{boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.from}];
        this.db.database.ref("users-list/"+this.id+"/gradeCollaboration").set(this.gradeCollaboration);  
      
      }
}
    else
    {
      for(var i=0 ; i<this.gradeCollaboration.length ; i++)
      {
        if(this.gradeCollaboration[i]["boardName"]===this.boradName && this.gradeCollaboration[i]["difficulty"] ===this.difficulty)
        {
          if((this.authApi.getSessionStorage()===this.from && this.gradeCollaboration[i]["collaborator"] === this.to)|| (this.authApi.getSessionStorage()===this.to && this.gradeCollaboration[i]["collaborator"] === this.from))
          {
            if(this.winning===this.gradeCollaboration[i]["score"])//If I win the same number of points
            {
              this.gradeCollaboration.splice(i, 1);//Take out the previous one
              if(this.from===this.authApi.getSessionStorage())
              {
                this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.to});
              }
              else if(this.to===this.authApi.getSessionStorage())
              {
                this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.from});
              }
              this.winning=0;
              break;
            }
            else if(this.winning>this.gradeCollaboration[i]["score"])//If I win more points
            {
              var temp = this.gradeCollaboration[i]["score"]
              this.gradeCollaboration.splice(i, 1);//Take out the previous one
              if(this.from===this.authApi.getSessionStorage())
              {
                this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.to}); 
              }
              else if(this.to===this.authApi.getSessionStorage())
              {
                this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.from});
              }
              this.winning-=temp;  
              break;    
            }
            else//If I win less points
            {
              this.winning=0;
              break;
            }
          }
        }
          else if(i==this.gradeCollaboration.length-1)//Adding new grades to DB
          {
            if(this.from===this.authApi.getSessionStorage())
            {
              this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.to});
            }
            else if(this.to===this.authApi.getSessionStorage())
            {
              this.gradeCollaboration.push({boardName:this.boradName,difficulty:this.difficulty,score:this.winning,time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString(),collaborator:this.from});
            }
            break;
          }
        }
      this.db.database.ref("users-list/"+this.id+"/gradeCollaboration").set(this.gradeCollaboration);    
    }
    var modal4 = document.getElementById("myModal4");//you win
    if(modal4!=null)
    {
      modal4.style.display = "block";
      this.point+=this.winning;
     
    }
    this.db.database.ref("users-list/"+this.id+"/point").set(this.point);
  }

  close_box()//close you win box
  {
    var modal4 = document.getElementById("myModal4");
    if(modal4!=null)
    {
      modal4.style.display = "none";
      if(this.from===this.authApi.getSessionStorage())
      {
        this.collaborationSe.DeleteCollaboration(this.gameId)
      }
     
    }
    this.router.navigate(['/home-page']);
  }

  save_feedback()//Save feedback in DB
  {
    this.closeForm()
    if(this.difficulty==="קל")
    {
      this.boardSe.GetBoardsList_CollaborationEasy().snapshotChanges().subscribe(collection => {
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
              this.db.database.ref("sudoku-boards/collaboration/easy/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/collaboration/easy/"+boardId+"/feedback").set(feedbackData);  
              this.feedbackForm.value.feedback="";
              this.feedbackForm.value.rate="";
              i=collection.length;
              break;
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
              this.db.database.ref("sudoku-boards/collaboration/easy/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/collaboration/easy/"+boardId+"/feedback").set(feedbackData);
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
    this.boardSe.GetBoardsList_CollaborationMedium().snapshotChanges().subscribe(collection => {
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
              this.db.database.ref("sudoku-boards/collaboration/medium/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/collaboration/medium/"+boardId+"/feedback").set(feedbackData);
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
              this.db.database.ref("sudoku-boards/collaboration/medium/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/collaboration/medium/"+boardId+"/feedback").set(feedbackData);
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
    this.boardSe.GetBoardsList_CollaborationHard().snapshotChanges().subscribe(collection => {
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

              this.db.database.ref("sudoku-boards/collaboration/hard/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/collaboration/hard/"+boardId+"/feedback").set(feedbackData);
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
              this.db.database.ref("sudoku-boards/collaboration/hard/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/collaboration/hard/"+boardId+"/feedback").set(feedbackData);
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
    this.close_box()
  }
 

}


