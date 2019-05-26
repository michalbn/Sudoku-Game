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
  val:number;
  sec: number = 0;
  min: number = 0;
  hour: number = 0;
  interval;

  time:number=0;
  interval1;

  public feedbackForm: FormGroup;
  grade:Object[]=[];

  winning:number

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
    public fb: FormBuilder       // Form Builder service for Reactive forms
    ) { }

  ngOnInit() {
    this.feedbacForm()
    this.grade=[];
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
              this.grade=(item.payload.val().grade).slice()
              a['$key'] = item.key;
              this.User.push(a as User);
              this.point=this.User[0].point;
            }
          })
        })

        this.hour=0;
        this.min=0;
        this.sec=0;
        this.interval=0;
        this.timeInterval()

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

  feedbacForm()
  {
    this.feedbackForm= this.fb.group({
      feedback: ['', [Validators.required, ,Validators.maxLength(50)]],
      rate: ['', []]
    })  
  }

  get feedback() {//get user nickName
    return this.feedbackForm.get('feedback');
  }

  get rate() {
    return this.feedbackForm.get('rate');
  }

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
    //console.log(this.userChoice)
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

    //console.log(this.userChoice)

  }

  home()
  {
    clearInterval(this.interval);
    var r = confirm("לצאת מהמשחק?");
    if (r == true) 
    {
      
      this.router.navigate(['/single-game']);//go to new-user
    }
    else
    {
      
      this.timeInterval()
    }

    
  }

  help()
  {
    this.scanBoeard();
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
    else
    {
      this.toastr.info('אין לך מספיק נקודות');
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
        var alrt= " יש לך טעות בשורה " + (i+1).toString() + " ובעמודה " + (j+1).toString();
        this.toastr.warning(alrt, ':התראה');
        document.getElementById(cellId).style.backgroundColor='yellow';
        document.getElementById(cellId).style.borderRadius='50%'
        setTimeout(function(){
          document.getElementById(cellId).style.backgroundColor = 'white';  // Change the color back to the original
        }, 600);
        
        //console.log(this.userChoice)
       // console.log(i,j)
        return false;
      }
     }
    }
    // alert("you win");
    // //הוספת מידע ל DB
    // this.router.navigate(['/single-game']);//go to new-user
    clearInterval(this.interval);
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    var levelname = this.route.snapshot.paramMap.get('levelname');

     if(this.grade[0]["boardName"]=="")
    {
      // this.grade[0]["boardName"]=levelname
      // this.grade[0]["difficulty"]=difficulty
      // this.grade[0]["score"]=this.boardSe.calculatePoints(difficulty,this.sec,this.min)
      // this.grade[0]["time"]=this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()
      this.grade=[{boardName:levelname,difficulty:difficulty,score:this.boardSe.calculatePoints(difficulty,this.sec,this.min),time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()}];
      this.db.database.ref("users-list/"+this.id+"/grade").set(this.grade);  
    }
    else
    {

      this.grade.push({boardName:levelname,difficulty:difficulty,score:this.boardSe.calculatePoints(difficulty,this.sec,this.min),time:this.hour.toString()+":"+this.min.toString()+":"+this.sec.toString()});
      console.log(this.grade)
      this.db.database.ref("users-list/"+this.id+"/grade").set(this.grade);  
    }
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    this.winning=this.boardSe.calculatePoints(difficulty,this.sec,this.min)
    this.point+=this.winning;
    this.db.database.ref("users-list/"+this.id+"/point").set(this.point);
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
            
            this.temp=collection[i].payload.val().sudoku.slice()
           // console.log(this.easyTimes)
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
            // console.log(collection[i].payload.val().feedback)
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
    this.userChoice= new Array(9).fill("").map(() => new Array(9).fill(""));
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
     //  console.log(this.userChoice)
     }
   }

  }


  close_box()
  {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.interval1=0;
    this.interval1 = setInterval(() => {
      
      if(this.time===3)
      {
        clearInterval(this.interval1);
        this.router.navigate(['/single-game']);//go to new-user
      }
      else
      {
this.time++;
//console.log(this.time)
      }
    },100)
  //  this.router.navigate(['/single-game']);//go to new-user
  }

  timeInterval()
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


  save_feedback()
  {
    //console.log(this.feedbackForm.value.rate)
    //console.log(this.feedbackForm.value.feedback)
    var difficulty = this.route.snapshot.paramMap.get('difficulty');
    var levelname = this.route.snapshot.paramMap.get('levelname');

    if(difficulty==="קל")
    {
      this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
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
              rateData.vote=1
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
             // console.log(rateData)
              //console.log(feedbackData)
          
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/feedback").set(feedbackData);
              //this.router.navigate(['/single-game']);//go to new-user  
              this.feedbackForm.value.feedback=""
              this.feedbackForm.value.rate=""
              i=collection.length
            }
            else
            {
              rateData.vote+=1
              if(this.feedbackForm.value.rate=="")
              {
                rateData.rating=((rateData.rating)/2).toFixed(2);
              }
              else
              {
                rateData.rating=((rateData.rating+parseInt(this.feedbackForm.value.rate))/2).toFixed(2);
              }
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/rate").set(rateData);
              feedbackData.push({player:this.authApi.getSessionStorage(),playerFeedback:this.feedbackForm.value.feedback});
              this.db.database.ref("sudoku-boards/classic/easy/"+boardId+"/feedback").set(feedbackData);
              //this.router.navigate(['/single-game']);//go to new-user 
              this.feedbackForm.value.feedback="" 
              this.feedbackForm.value.rate=""
              i=collection.length
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
              rateData.vote=1
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
              //console.log(rateData)
              //console.log(feedbackData)
          
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/medium/"+boardId+"/feedback").set(feedbackData);
              //this.router.navigate(['/single-game']);//go to new-user  
              this.feedbackForm.value.feedback=""
              this.feedbackForm.value.rate=""
              i=collection.length
            }
            else
            {
              rateData.vote+=1
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
              //this.router.navigate(['/single-game']);//go to new-user 
              this.feedbackForm.value.feedback="" 
              this.feedbackForm.value.rate=""
              i=collection.length
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
              rateData.vote=1
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
        //      console.log(rateData)
          //    console.log(feedbackData)
          
              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/rate").set(rateData);
              this.db.database.ref("sudoku-boards/classic/hard/"+boardId+"/feedback").set(feedbackData);
              //this.router.navigate(['/single-game']);//go to new-user  
              this.feedbackForm.value.feedback=""
              this.feedbackForm.value.rate=""
              i=collection.length
            }
            else
            {
              rateData.vote+=1
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
              //this.router.navigate(['/single-game']);//go to new-user 
              this.feedbackForm.value.feedback="" 
              this.feedbackForm.value.rate=""
              i=collection.length
            }

            }           
          }      
        }
        return
      })

    }
    this.router.navigate(['/single-game']);//go to new-user 
  }
}
