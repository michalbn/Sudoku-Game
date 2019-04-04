import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { database } from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';
import { Board } from '../shared/Board';


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


  constructor(public authApi: AuthService,
              private router: Router,
              private actRoute: ActivatedRoute,
              public boardSe : SudokuBoardsService,
              private db: AngularFireDatabase
             ) { }

  ngOnInit() {   
    this.boardSe.GetAllBoradsList();  // Call GetAllBoradsList before main form is being called
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
        }
      })
      if(data.length===1)//add sudoku boards
      {
        
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
          
      }      
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
