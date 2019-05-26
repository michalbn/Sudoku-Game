import { Component, OnInit } from '@angular/core';
import { Friend } from '../shared/friend';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';
import { Router } from '@angular/router';
import { SudokuBoardsService } from '../shared/sudoku-boards.service';

@Component({
  selector: 'app-friends-game-page',
  templateUrl: './friends-game-page.component.html',
  styleUrls: ['./friends-game-page.component.css']
})
export class FriendsGamePageComponent implements OnInit {
  User: User[];// My user   
  friend: Friend[]=[];//My friend list

  friends_list:string[]=[];
  friends_login:string[]=[];

  easyBoard: string[]=[];//My friend list - status approved
  mediumBoard: string[]=[];//My friend list - status approved
  hardBoard: string[]=[];//My friend list - status approved

  constructor(public authApi: AuthService, private router : Router, public boardSe : SudokuBoardsService) {
    
   }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      this.friends_list=[];
      let s = this.authApi.GetUsersList(); //find my user
      s.snapshotChanges().subscribe(data => { // Using snapshotChanges() method to retrieve list of data along with metadata($key)
        this.User = [];
        this.friend = [];
        data.forEach(item => {
          let a = item.payload.toJSON();
          if(a["nickName"]===this.authApi.getSessionStorage()&& this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-game-page")
          {
            a['$key'] = item.key;
            this.User.push(a as User);
            this.friend = Object.assign(this.friend,this.User[0].friendList);
            this.friends_list=[];
            return;
          }
        })
        if(this.authApi.getSessionStorage()!=="" && this.router.routerState.snapshot.url ==="/friends-game-page")
        {
          for (var i = 0; i < this.friend.length; i++) //Shows my friends
          {
            this.friends_list.push(this.friend[i].friendName);
          }        
        }
        this.friends_login=[]
        if(this.router.routerState.snapshot.url ==="/friends-game-page" && this.friends_list.length!=0)
        {
          for (var i = 0; i < this.friends_list.length; i++) 
          {
            for (var j = 0; i < data.length; j++) 
            {
              if(data[j].payload.val().nickName===this.friends_list[i])
              {
                if(data[j].payload.val().login==true)
                {
                  this.friends_login.push(this.friends_list[i])
                  break;
                }
                else
                {
                  break;
                }
              }
            }
          }
          if(this.friends_login.length==0)//no friends
          {
            this.check_fields("")

  
          }
          else if(this.friends_login.length>0)
          {
            var temp = (document.getElementById('selectid2') as HTMLInputElement).value
            var count=0
            for(i=0;i<this.friends_login.length;i++)
            {
              if(this.friends_login[i]===temp)
              {
                count=1
                break;
              }
              
            }
            if(count===0)
            {
              this.check_fields("")
            }
  
          }
         
        }
      })
    }

  }

  check_fields(friends)
  {
    console.log(friends)
    var onlinefriends
    if(friends===undefined)
    {
      onlinefriends= (document.getElementById('selectid2') as HTMLInputElement).value//Online friends
    }
    else
    {
      onlinefriends=""
    }
    var gameType = (document.getElementById('selectid') as HTMLInputElement).value//Game Type
    var difficulty = (document.getElementById('selectid1') as HTMLInputElement).value//Level of difficulty

    if(onlinefriends!=="" && gameType !=="" && difficulty!=="")
    {
      if(onlinefriends!=="לא קיימים")
      {
        //לקרוא לפונקציה
        this.create_sudoku_boards(gameType,difficulty,onlinefriends)
      }
    }
    else
    {
      this.easyBoard=[];
      this.mediumBoard=[];
      this.hardBoard=[];
    }
  }

  play()
  {
    this.router.navigate(['/classic-game']);//go to new-user
  }

  mark(levelName)
  {
    if(document.getElementById(levelName).style.color=="rgb(2, 7, 136)")
      document.getElementById(levelName).style.color="black";
    else
    {
      document.getElementById(levelName).style.color="rgb(2, 7, 136)";
    }
    levelName=null;
  }

  create_sudoku_boards(gameType,difficulty,onlinefriends)
  {
    this.easyBoard=[];
    this.mediumBoard=[];
    this.hardBoard=[];

    if(gameType==="תחרות")
    {
      switch(difficulty) {  
        case "קל": { 
          this.boardSe.GetBoardsList_CompetitionEasy().snapshotChanges().subscribe(collection => {
            this.easyBoard=[];
            for (var i = 0; i < collection.length; i++) 
            {
              
              this.easyBoard.push(collection[i].payload.val());
            }
            console.log(this.easyBoard)
          })
           break;
        }
        case "בינוני": { 
          this.boardSe.GetBoardsList_CompetitionMedium().snapshotChanges().subscribe(collection => {
            this.mediumBoard=[];
            for (var i = 0; i < collection.length; i++) 
            {
              this.mediumBoard.push(collection[i].payload.val()); 
            }
          })
           break;
        }
        case "קשה": { 
          this.boardSe.GetBoardsList_CompetitionHard().snapshotChanges().subscribe(collection => {
            this.hardBoard=[];
            for (var i = 0; i < collection.length; i++) 
            {
              this.hardBoard.push(collection[i].payload.val()); 
            }
          })
           break;
        }
     }
    }
    else if(gameType=="שיתוף פעולה")
    {
      this.easyBoard=[];
      this.mediumBoard=[];
      this.hardBoard=[];
      switch(difficulty) {  
        case "קל": { 
          this.boardSe.GetBoardsList_CollaborationEasy().snapshotChanges().subscribe(collection => {
            this.easyBoard=[];
            for (var i = 0; i < collection.length; i++) 
            {
              this.easyBoard.push(collection[i].payload.val()); 
            }
          })
           break;
        }
        case "בינוני": { 
          this.boardSe.GetBoardsList_CollaborationMedium().snapshotChanges().subscribe(collection => {
            this.mediumBoard=[];
            for (var i = 0; i < collection.length; i++) 
            {
              this.mediumBoard.push(collection[i].payload.val()); 
            }
          })
           break;
        }
        case "קשה": { 
          this.boardSe.GetBoardsList_CollaborationHard().snapshotChanges().subscribe(collection => {
            this.hardBoard=[];
            for (var i = 0; i < collection.length; i++) 
            { 
              this.hardBoard.push(collection[i].payload.val());
            }
          })
           break;
        }
     }
    }
  }
}
