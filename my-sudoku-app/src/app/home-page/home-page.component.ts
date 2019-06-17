import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { database } from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { Board } from '../shared/Board';
import { MessageService } from '../shared/message.service';
import { message } from '../shared/message';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
userName: string;
today: number = Date.now();
User: User[];  

id:string;
point:number;

Message : message[];
Message1 : message[];
msgid:string;
confirmFlag:boolean
lenDB:number



  constructor(public authApi: AuthService,
              private router: Router,
              private actRoute: ActivatedRoute,
              public boardSe : SudokuBoardsService,
              private db: AngularFireDatabase,
              private messageService: MessageService,
              private af: AngularFireDatabase
             ) { }

  ngOnInit() {   
    this.boardSe.GetAllBoradsList();  // Call GetAllBoradsList before main form is being called
    this.messageService.GetMessagesList();
    let s = this.authApi.GetUsersList(); //list of users
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();
        
        if(a["nickName"]===this.userName)
        {
          this.id=item.key ;
          a['$key'] = item.key;
          this.User.push(a as User);
          this.point=this.User[0].point;
          
        }
      })
      if(data.length===1)//add sudoku boards
      {
        ////////////////////Classic///////////////////////////
        this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {   
            var myArr=[1,2,3,4,5,6,7,8,9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))//shift after eight rounds
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);//Create a Sudoku board
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsListMedium().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[1,3,5,7,9,8,2,4,6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
         // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsListHard().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[5,6,3,2,9,8,1,4,7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]}
              this.boardSe.AddBoradHard(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })

        ///////////////////////Competition////////////////////////////
        this.boardSe.GetBoardsList_CompetitionEasy().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {   
            var myArr=[2,3,4,6,7,8,1,5,9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))//shift after eight rounds
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);//Create a Sudoku board
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddCompetitionBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CompetitionMedium().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[3,5,7,8,2,4,1,9,6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddCompetitionBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
         // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CompetitionHard().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[6,3,2,8,1,4,5,9,7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]}
              this.boardSe.AddCompetitionBoradHard(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        
        /////////////////////////////////Collaboration//////////////////////////////
        this.boardSe.GetBoardsList_CollaborationEasy().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {   
            var myArr=[3,4,6,8,1,5,2,7,9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))//shift after eight rounds
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);//Create a Sudoku board
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddCollaborationBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CollaborationMedium().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[5,7,8,4,1,9,3,2,6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board;
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]};
              this.boardSe.AddCollaborationBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
         // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CollaborationHard().snapshotChanges().subscribe(collection => {
          if(collection.length===0)
          {
            var myArr=[3,2,8,4,5,9,6,1,7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if(((myArr.length-1)==(i%9))&&(i!=0))
              {
                myArr=myArr.concat(myArr.splice(0,1));
              }
              var temp=myArr.slice();
              var board=this.create_sudoku_boards(temp,i%9);
              var boardDB:Board
              boardDB={boardName:"Level "+i.toString(),sudoku:board.slice(),rate:{rating:0,vote:0},feedback:[{player:"",playerFeedback:""}]}
              this.boardSe.AddCollaborationBoradHard(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        
        //////////////////////////////////////////////////////////////////
        
          
      }   
      else return;   
    })
        //////message alert
        this.messageService.GetMessagesList().snapshotChanges().subscribe(collection => {
          this.Message = [];
          collection.forEach(item => {
            let a = item.payload.toJSON();
            console.log(a["to"])
            if(a["to"]===this.authApi.getSessionStorage() && a["status"]==="hold")
            {
              this.msgid=item.key
              this.Message.push(a as message);
            }
         })        
          console.log(this.Message)
          // for(var i=0 ; i<this.Message.length ; i++)
          if(this.Message.length>1)
          {
            location.reload();
          }
          else if(this.Message.length===1)
          {
           if(this.Message[0].to===this.authApi.getSessionStorage()&& this.Message[0].status==="hold")
            {
              this.confirmFlag = confirm(this.Message[0].massage);
              if(this.confirmFlag!=null)
              {
                console.log(this.messageService.GetMessagesList.length)
                console.log(this.confirmFlag)
                if(this.Message.length===1)
                {
                  if (this.confirmFlag == true) //exit
                  {
  
                  //   break
                  console.log(this.Message) 
                  this.delay(300,collection) 
                //  this.confirmFlag=null;  
                  
                          
                  }
                  else if(this.confirmFlag==false)
                  {
                    if(this.Message.length===1)
                    {
                      //this.messageService.DeleteMessage(collection[0].key)
                      this.delay1(100,collection) 
                    //   this.db.database.ref("messages-list/"+collection[0].key+"/status").set("canceled")
                    // this.Message=[];
                   // this.confirmFlag=null;
                    }
                    else
                    {
                      this.Message=[]
                    }
                    return
                  }
                  else
                  {
                    this.ngOnInit()
                  }
                }
                else
                {
                  this.ngOnInit()
                }
              }

            }
           
          }

          
          return;
        })

    this.today = Date.now();//showing the date
    this.userName=this.authApi.userLogin;//enter the global nickName to variable
    if(this.userName!=null)//if global variable not null
    {
          this.authApi.setSessionStorage(this.authApi.userLogin);//setSessionStorage
    }

    else if(this.authApi.getSessionStorage()!=null)///if session not null
    {
      this.userName=this.authApi.getSessionStorage();//update global nickName
    }
    else
    {
      this.router.navigate(['/']);//go to new-user
    }
  }

    // Contains Reactive Form logic

    async delay(ms: number,collection) {
      await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>this.conf(collection));
  }

  async delay1(ms: number,collection) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>this.cencel(collection));
}

cencel(collection)
{
 // console.log(Object.keys(collection[0].payload.val()).length)
//  if(this.Message[0]!=null)
//  {
//   console.log(Object.keys(this.Message[0]).length)
//  }
//  else
//  {
//    console.log("dsfgh")
//  }
    this.messageService.GetMessagesList().snapshotChanges().subscribe(collection1 => {this.lenDB= collection1.length})
    console.log(this.Message)
    console.log(this.msgid)
    console.log(collection[0].key)
    console.log(this.confirmFlag)
    //console.log(this.af.database.('messages-list'))
    // if(this.lenDB===0)
    // {
    //   this.Message=[];
    //   return;
    // }

    if(this.Message.length>=2)
    {
      this.Message=[];
      this.confirmFlag=null
      // this.ngOnInit()
      return;
    }
    else if(this.confirmFlag===false && this.Message.length==1)
    {
      this.af.database.ref('messages-list/').transaction(ab=>{
        if(ab===null)
        {console.log("empty id"); console.log(ab);
      this.confirmFlag=null;
            this.Message=[];
            // this.ngOnInit()
            return;
          }
      else {
        if(ab[Object.keys(ab)[0]]["to"]===this.authApi.getSessionStorage())
        {
          console.log("exsit id"); console.log(Object.keys(ab)[0]);
          if(this.msgid===Object.keys(ab)[0] && this.confirmFlag===false)
          {
            this.db.database.ref("messages-list/"+Object.keys(ab)[0]+"/status").set("canceled");
            this.confirmFlag=null;
            this.Message=[];
            return;
          }
          else
          {
            // this.confirmFlag=null;
            // this.Message=[];
            // return;
            this.conf(collection)
            this.confirmFlag=null;
            this.Message=[];
            return;
          }
        }

    } 
     return
    })
    }
    else if(this.confirmFlag!=null && this.Message.length==1)
    {
      this.conf(collection)
            this.confirmFlag=null;
            this.Message=[];
            return;
    }

    this.Message=[];
      this.confirmFlag=null
      return;
    // else if(this.confirmFlag===true)
    // {
    //   this.conf(collection)
    // }
    // else if(this.confirmFlag===null)
    // {

    // }

//     if(this.confirmFlag===null)
//     {
//       this.messageService.DeleteMessage(this.msgid)
//     }
//     if(this.Message.length!==0 && (this.msgid ===collection[0].key))
//     {
     
//       this.db.database.ref("messages-list/"+this.msgid+"/status").set("canceled")
//       this.confirmFlag=null
//       this.Message=[];
//       return;
      
//     }
//     else if(this.Message.length!==0  &&(collection[0].key !== this.msgid) && this.confirmFlag===true)
//     {
     
//       this.db.database.ref("messages-list/"+this.msgid+"/status").set("approved")
//       if(this.Message[0].game=="תחרות")
//       {
//         this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
//         this.Message=[];
//         this.confirmFlag=null
//         return;
//       }
//       else
//       {
//         this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
//         this.Message=[];
//         this.confirmFlag=null
//         return;
//       }
//     }
//     else if(this.Message.length!==0  &&(collection[0].key !== this.msgid) && this.confirmFlag===false)
//     {
// //לבדוק ID פה
// this.af.database.ref('messages-list/').transaction(ab=>{if(ab===null){console.log("empty id"); console.log(ab)}
// else {console.log("exsit id")} ; console.log(ab)})

//       this.db.database.ref("messages-list/"+this.msgid+"/status").set("canceled")
//       this.confirmFlag=null
//       this.Message=[];
//       return
        
//     }
//     else if(this.Message.length===0)
//     {
//      // this.db.database.ref("messages-list/"+collection[i].key+"/status").set("canceled")
//      this.Message=[];
//      this.confirmFlag=null
//      //this.ngOnInit()
     
//       return;
//     }
}


  conf(collection)
  {
    console.log(this.Message)
    console.log(this.msgid)
    console.log(collection[0].key)
    console.log(this.confirmFlag)
    console.log(this.Message.length)

    if(this.Message.length>=2)
    {
      this.Message=[];
      this.confirmFlag=null
      // this.ngOnInit()
      return;
    }

    else if(this.confirmFlag===true && this.Message.length==1)
    {
      this.af.database.ref('messages-list/').transaction(ab=>{if(ab===null){console.log("empty id"); console.log(ab);
    this.confirmFlag=null;
          this.Message=[];
          // this.ngOnInit()
          return;}
    else {console.log("exsit id") ; console.log(Object.keys(ab)[0]);
    
    console.log(ab[Object.keys(ab)[0]]["game"]);
    if(this.msgid===Object.keys(ab)[0] && this.confirmFlag===true)
    {
    this.db.database.ref("messages-list/"+Object.keys(ab)[0]+"/status").set("approved")
      if(ab[Object.keys(ab)[0]]["game"]=="תחרות")
      {
        this.router.navigate(['/competition-game',ab[Object.keys(ab)[0]]["game"],ab[Object.keys(ab)[0]]["from"],ab[Object.keys(ab)[0]]["to"],ab[Object.keys(ab)[0]]["difficulty"],ab[Object.keys(ab)[0]]["boradName"]]);//go to new-user
        this.Message=[];
        this.confirmFlag=null
        return;
      }
      else
      {
        this.router.navigate(['/competition-game',ab[Object.keys(ab)[0]]["game"],ab[Object.keys(ab)[0]]["from"],ab[Object.keys(ab)[0]]["to"],ab[Object.keys(ab)[0]]["difficulty"],ab[Object.keys(ab)[0]]["boradName"]]);//go to new-user
        this.Message=[];
        this.confirmFlag=null
        return;
      }
    }
  }
    return;
  })
  return

    }
    else if(this.confirmFlag!=null && this.Message.length==1)
    {
      //this.ca(collection)
      this.cencel(collection) 
      this.Message=[];
      this.confirmFlag=null
      return;
    }
  


    this.Message=[];
    this.confirmFlag=null
    return;

    
  

    // this.messageService.GetMessagesList().snapshotChanges().subscribe(collection1 => {this.lenDB= collection1.length})
    // console.log(this.lenDB)
    // if(this.lenDB===1)
    // {
    //   this.Message=[];
    //   return;
    // }

    // if((this.Message.length!==0  &&(collection[0].key === this.msgid))||(this.Message.length!==0  &&(collection[0].key !== this.msgid)&&this.confirmFlag===true ))
    // {
    //  console.log(this.messageService.GetMessage(this.msgid))
    //  this.af.database.ref('messages-list/').transaction(ab=>{if(ab===null){console.log("empty id"); console.log(ab)}
    // else {console.log("exsit id")} })
    //   this.db.database.ref("messages-list/"+this.msgid+"/status").set("approved")
    //   console.log(Object.keys(this.Message[0]))
    //   if(this.Message[0].game=="תחרות")
    //   {
    //     this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
    //     this.Message=[];
    //     this.confirmFlag=null
    //     return;
    //   }
    //   else
    //   {
    //     this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
    //     this.Message=[];
    //     this.confirmFlag=null
    //     return;
    //   }
    // }
    // else if(this.Message.length!==0  &&(collection[0].key !== this.msgid) && this.confirmFlag===false)
    // {

    //   this.db.database.ref("messages-list/"+this.msgid+"/status").set("canceled")
    //   this.Message=[];
    //   this.confirmFlag=null
    //   return
        
    // }
    // else if(this.Message.length===0)
    // {
    //  // this.db.database.ref("messages-list/"+collection[i].key+"/status").set("canceled")
    //  this.Message=[];
    //  this.confirmFlag=null
    //  //this.ngOnInit()
     
    //   return;
    // }


  }


  logout()
  {
    //this.db.database.ref("users-list/"+this.id+"/login").set(false)
    this.authApi.UpdateUserLogin(this.id,this.User[0],false)
    this.authApi.disconnect=0;
    this.authApi.delSessionStorage();
    this.userName=null;
    this.router.navigate(['/']);//go to new-user
  }

  //Create sudoku boards from array and position
  create_sudoku_boards(arr,pos)
  {
    var board=Array(9).fill(0).map(x => Array(9).fill(0))//9x9 - 2D arr
    board[pos]=arr.slice();//copy array to the pos position in board
    if((Math.floor(pos/3))===2)//The last three lines , (floor = int) 
    {
      if((pos%3)===2)//last line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos-6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-7]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-8]=arr.slice();
        //console.log(board)
        
      }
      if((pos%3)===1)//Middle line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();
        board[pos-6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-7]=arr.slice();
        //console.log(board)
        
      }
      if((pos%3)===0)//first line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();
        board[pos-6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-4]=arr.slice();
        //console.log(board)
        
      }
    }
    if((Math.floor(pos/3))===1)//The Middle three lines , (floor = int) 
    {
      if((pos%3)===2)//last line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));////To start
        arr=this.new_row(arr).slice();
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-5]=arr.slice();
        //console.log(board)
        
      }
      if((pos%3)===1)//Middle line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-4]=arr.slice();
        //console.log(board)
        
      }
      if((pos%3)===0)//first line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();
        board[pos-3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-1]=arr.slice();
       // console.log(board)
        
      }
    }
    if((Math.floor(pos/3))===0)//The first three lines , (floor = int) 
    {
      if((pos%3)===2)//last line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();
        board[pos+6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+4]=arr.slice();
       // console.log(board)
        
      }
      if((pos%3)===1)//Middle line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos-1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();
        board[pos+6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+7]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+5]=arr.slice();
       // console.log(board)
        
      }
      if((pos%3)===0)//first line
      {
        arr=arr.concat(arr.splice(0,3));//shift
        board[pos+1]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+2]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();//Changing locations of 3
        board[pos+3]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+4]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+5]=arr.slice();
        arr=arr.concat(arr.splice(0,3));//To start
        arr=this.new_row(arr).slice();
        board[pos+6]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+7]=arr.slice();
        arr=arr.concat(arr.splice(0,3));
        board[pos+8]=arr.slice();
        //console.log(board)
        
      }
     
    }
    return board;
  }

  new_row(arr)//Move 3 cells and create a new row
  {
    var x=arr.slice(0,3)
    var y=arr.slice(3,6)
    var z=arr.slice(6,9)
    x=x.concat(x.splice(0,1));
    y=y.concat(y.splice(0,1));
    z=z.concat(z.splice(0,1));
    var arr1=[]
    arr1=arr1.concat(x,y,z)
    return arr1;
  }
  

}
