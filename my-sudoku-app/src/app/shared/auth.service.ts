import { Injectable } from '@angular/core';
import { User } from '../shared/user';  // Student data type interface class
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Friend } from './friend';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  valid ;
  usersRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  userRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too
  public userLogin: string;  
  disconnect: number


  BackgroundColor;//צבע הרקע
  headersColor;//צבע הכותרות
  BackgroundBoardColor;//צבע רקע הלוח
  helpNumbersColor;//צבע מספרי העזרה
  numbersColor;

  //  numbersColor:
  //  BackgroundBoardColor="#FFFFFF"
  //BoardColor:string//צבע רקע הלוח




  constructor(private db: AngularFireDatabase,
              private storage:LocalStorageService,
              private sessionSt: SessionStorageService,
              private localSt: LocalStorageService
              ) { }

    // Create User
    AddUser(user: User,login:boolean,friendName :string,status: string,point:number) {
      this.usersRef.push({
        nickName: user.nickName,
        password: user.password,
        point:point,
        login: login,
        friendList: {friendName:friendName, status:status},
        grade: [{boardName:"",time:"",score:0, difficulty:""}],
        gradeCompetition: [{boardName:"",time:"",score:0, difficulty:"",rival:""}],
        gradeCollaboration: [{boardName:"",time:"",score:0, difficulty:"",collaborator:""}],
        color:{BackgroundColor:"#FFFFFF",headersColor:"#87CEFA",BackgroundBoardColor:"#FFFFFF",helpNumbersColor:"#BCE0F7",numbersColor:"#000000"}  
      })
    }


    // Fetch Single User Object
    GetUser(id: string) {
      this.userRef = this.db.object('users-list/' + id);
      return this.userRef;
    }

  // Fetch Users List
  GetUsersList() {
    this.usersRef = this.db.list('users-list');
    return this.usersRef;
  }
    
    // Delete User Object
    DeleteUser(id: string) { 
      this.userRef = this.db.object('users-list/'+id);
      this.userRef.remove();
    }

    UpdateUserLogin(id: string, user:User,login:boolean)
    {
      this.db.object('users-list/'+id).set({
        nickName: user.nickName,
        password: user.password,
        point: user.point,
        login: login,
        friendList:user.friendList,
        grade:user.grade,
        gradeCompetition:user.gradeCompetition,
        gradeCollaboration:user.gradeCollaboration,
        color:user.color
       // friendList: {friendName:user.fzz, status:null}
        
      })
    }

    UpdateUserFriend(id: string, user:User,friend: Friend[])
    {
      this.db.object('users-list/'+id).set({
        nickName: user.nickName,
        password: user.password,
        point: user.point,
        login: user.login,
        friendList:friend,
        grade:user.grade,
        gradeCompetition:user.gradeCompetition,
        gradeCollaboration:user.gradeCollaboration,
        color:user.color
       // friendList: {friendName:user.fzz, status:null}
        
      })
    }
 
    //session- get , set , delete
    setSessionStorage(nickName:string)
    {
      this.sessionSt.store("logged-in",nickName);
    }
  
    getSessionStorage()
    {
     return this.sessionSt.retrieve("logged-in");
    }
  
    delSessionStorage()
    {
      this.sessionSt.clear("logged-in");
      this.sessionSt.clear("Background-color");
      this.sessionSt.clear("headers-color");
      this.sessionSt.clear("Background-board-color");
      this.sessionSt.clear("help-numbers-color");
      this.sessionSt.clear("numbers-color");
    }


    /////////////color setting
    setSessionColorBackgroundColor(BackgroundColor:string)
    {
      this.sessionSt.store("Background-color",BackgroundColor);
    }

    setSessionColorheadersColor(headersColor:string)
    {
      this.sessionSt.store("headers-color",headersColor);
    }

    setSessionColorBackgroundBoardColor(BackgroundBoardColor:string)
    {
      this.sessionSt.store("Background-board-color",BackgroundBoardColor);
    }

    setSessionColorhelpNumbersColor(helpNumbersColor:string)
    {
      this.sessionSt.store("help-numbers-color",helpNumbersColor);
    }

    setSessionColornumbersColor(numbersColor:string)
    {
      this.sessionSt.store("numbers-color",numbersColor);
    }

    /////////////color gettt
    getSessionColorBackgroundColor()
    {
      return this.sessionSt.retrieve("Background-color");
    }

    getSessionColorheadersColor()
    {
      return this.sessionSt.retrieve("headers-color");
    }

    getSessionColorBackgroundBoardColor()
    {
      return this.sessionSt.retrieve("Background-board-color");
    }

    getSessionColorhelpNumbersColor()
    {
      return this.sessionSt.retrieve("help-numbers-color");
    }

    getSessionColornumbersColor()
    {
      return this.sessionSt.retrieve("numbers-color");
    }

        /////////////color update
        updateSessionColorBackgroundColor(BackgroundColor:string)
        {
          this.sessionSt.clear("Background-color");
          this.sessionSt.store("Background-color",BackgroundColor);
        }
    
        updateSessionColorheadersColor(headersColor:string)
        {
          this.sessionSt.clear("headers-color");
          this.sessionSt.store("headers-color",headersColor);
        }
    
        updateSessionColorBackgroundBoardColor(BackgroundBoardColor:string)
        {
          this.sessionSt.clear("Background-board-color");
          this.sessionSt.store("Background-board-color",BackgroundBoardColor);
        }
    
        updateSessionColorhelpNumbersColor(helpNumbersColor:string)
        {
          this.sessionSt.clear("help-numbers-color");
          this.sessionSt.store("help-numbers-color",helpNumbersColor);
        }
    
        updateSessionColornumbersColor(numbersColor:string)
        {
          this.sessionSt.clear("numbers-color");
          this.sessionSt.store("numbers-color",numbersColor);
        }

    
    

    
    
}
