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

  // BackgroundColor;//צבע הרקע
  // headersColor;//צבע הכותרות
  // BackgroundBoardColor;//צבע רקע הלוח
  // helpNumbersColor;//צבע מספרי העזרה
  // numbersColor;

  id: string;
  point: number;

  constructor(public authApi: AuthService,
    private router: Router,
    public boardSe: SudokuBoardsService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.boardSe.GetAllBoradsList();  // Call GetAllBoradsList before main form is being called
    this.messageService.GetMessagesList();
    let s = this.authApi.GetUsersList(); //list of users
    s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
      this.User = [];
      data.forEach(item => {
        let a = item.payload.toJSON();

        if (a["nickName"] === this.userName) {
          this.id = item.key;
          this.authApi.valid=this.id
          a['$key'] = item.key;
          this.User.push(a as User);
          this.point = this.User[0].point;

        }
      })
      // if(this.User.length>0)
      // {
      //   this.BackgroundColor=this.User[0].color.BackgroundBoardColor
      //   this.headersColor=this.User[0].color.headersColor
      //   this.BackgroundBoardColor=this.User[0].color.BackgroundBoardColor
      //   this.helpNumbersColor=this.User[0].color.helpNumbersColor
      //   this.numbersColor=this.User[0].color.numbersColor
      // }
      if (data.length === 1)//add sudoku boards
      {
        ////////////////////Classic///////////////////////////
        this.boardSe.GetBoardsListEasy().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0))//shift after eight rounds
              {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);//Create a Sudoku board
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsListMedium().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [1, 3, 5, 7, 9, 8, 2, 4, 6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsListHard().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [5, 6, 3, 2, 9, 8, 1, 4, 7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] }
              this.boardSe.AddBoradHard(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })

        ///////////////////////Competition////////////////////////////
        this.boardSe.GetBoardsList_CompetitionEasy().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [2, 3, 4, 6, 7, 8, 1, 5, 9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0))//shift after eight rounds
              {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);//Create a Sudoku board
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddCompetitionBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CompetitionMedium().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [3, 5, 7, 8, 2, 4, 1, 9, 6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddCompetitionBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CompetitionHard().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [6, 3, 2, 8, 1, 4, 5, 9, 7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] }
              this.boardSe.AddCompetitionBoradHard(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })

        /////////////////////////////////Collaboration//////////////////////////////
        this.boardSe.GetBoardsList_CollaborationEasy().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [3, 4, 6, 8, 1, 5, 2, 7, 9];//board      
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0))//shift after eight rounds
              {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);//Create a Sudoku board
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddCollaborationBoradEasy(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CollaborationMedium().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [5, 7, 8, 4, 1, 9, 3, 2, 6];//board
            for (var i = 0; i < 15; i++) //create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board;
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] };
              this.boardSe.AddCollaborationBoradMedium(boardDB);//Saving in db
            }
            return;
          }
          else return;
        })
        // The same thing as "Easy"- difficulty level
        this.boardSe.GetBoardsList_CollaborationHard().snapshotChanges().subscribe(collection => {
          if (collection.length === 0) {
            var myArr = [3, 2, 8, 4, 5, 9, 6, 1, 7];//board
            for (var i = 0; i < 15; i++) ////create 30 boards
            {
              if (((myArr.length - 1) == (i % 9)) && (i != 0)) {
                myArr = myArr.concat(myArr.splice(0, 1));
              }
              var temp = myArr.slice();
              var board = this.create_sudoku_boards(temp, i % 9);
              var boardDB: Board
              boardDB = { boardName: "Level " + i.toString(), sudoku: board.slice(), rate: { rating: 0, vote: 0 }, feedback: [{ player: "", playerFeedback: "" }] }
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
    
    this.messageService.alertMsg(this.router.url)
   

    this.today = Date.now();//showing the date
    this.userName = this.authApi.userLogin;//enter the global nickName to variable
    if (this.userName != null)//if global variable not null
    {
      this.authApi.setSessionStorage(this.authApi.userLogin);//setSessionStorage
      this.authApi.setSessionColorBackgroundColor(this.authApi.BackgroundColor);
      this.authApi.setSessionColorheadersColor(this.authApi.headersColor);
      this.authApi.setSessionColorBackgroundBoardColor(this.authApi.BackgroundBoardColor);
      this.authApi.setSessionColorhelpNumbersColor(this.authApi.helpNumbersColor);
      this.authApi.setSessionColornumbersColor(this.authApi.numbersColor);
    }

    else if (this.authApi.getSessionStorage() != null)///if session not null
    {
      this.userName = this.authApi.getSessionStorage();//update global nickName
      this.authApi.BackgroundColor=this.authApi.getSessionColorBackgroundColor()
      this.authApi.headersColor=this.authApi.getSessionColorheadersColor()
      this.authApi.BackgroundBoardColor=this.authApi.getSessionColorBackgroundBoardColor()
      this.authApi.helpNumbersColor=this.authApi.getSessionColorhelpNumbersColor()
      this.authApi.numbersColor=this.authApi.getSessionColornumbersColor()
    }
    else {
      this.router.navigate(['/']);//go to new-user
    }
  }

  // Contains Reactive Form logic



  logout() {
    //this.db.database.ref("users-list/"+this.id+"/login").set(false)
    this.authApi.UpdateUserLogin(this.id, this.User[0], false)
    this.authApi.disconnect = 0;
    this.authApi.delSessionStorage();
    this.userName = null;
    this.router.navigate(['/']);//go to new-user
  }

  //Create sudoku boards from array and position
  create_sudoku_boards(arr, pos) {
    var board = Array(9).fill(0).map(x => Array(9).fill(0))//9x9 - 2D arr
    board[pos] = arr.slice();//copy array to the pos position in board
    if ((Math.floor(pos / 3)) === 2)//The last three lines , (floor = int) 
    {
      if ((pos % 3) === 2)//last line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos - 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 7] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 8] = arr.slice();
    

      }
      if ((pos % 3) === 1)//Middle line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();
        board[pos - 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 7] = arr.slice();
 

      }
      if ((pos % 3) === 0)//first line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();
        board[pos - 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 4] = arr.slice();
   

      }
    }
    if ((Math.floor(pos / 3)) === 1)//The Middle three lines , (floor = int) 
    {
      if ((pos % 3) === 2)//last line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));////To start
        arr = this.new_row(arr).slice();
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 5] = arr.slice();
     

      }
      if ((pos % 3) === 1)//Middle line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 4] = arr.slice();
        

      }
      if ((pos % 3) === 0)//first line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();
        board[pos - 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 1] = arr.slice();
        

      }
    }
    if ((Math.floor(pos / 3)) === 0)//The first three lines , (floor = int) 
    {
      if ((pos % 3) === 2)//last line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();
        board[pos + 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 4] = arr.slice();
    

      }
      if ((pos % 3) === 1)//Middle line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos - 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();
        board[pos + 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 7] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 5] = arr.slice();
      

      }
      if ((pos % 3) === 0)//first line
      {
        arr = arr.concat(arr.splice(0, 3));//shift
        board[pos + 1] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 2] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();//Changing locations of 3
        board[pos + 3] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 4] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 5] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));//To start
        arr = this.new_row(arr).slice();
        board[pos + 6] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 7] = arr.slice();
        arr = arr.concat(arr.splice(0, 3));
        board[pos + 8] = arr.slice();
       

      }

    }
    return board;
  }

  new_row(arr)//Move 3 cells and create a new row
  {
    var x = arr.slice(0, 3)
    var y = arr.slice(3, 6)
    var z = arr.slice(6, 9)
    x = x.concat(x.splice(0, 1));
    y = y.concat(y.splice(0, 1));
    z = z.concat(z.splice(0, 1));
    var arr1 = []
    arr1 = arr1.concat(x, y, z)
    return arr1;
  }


}
