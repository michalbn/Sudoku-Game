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
        gradeCompetition: [{boardName:"",time:"",score:0, difficulty:"",rival:""}]
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
        gradeCompetition:user.gradeCompetition
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
        gradeCompetition:user.gradeCompetition
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
    }

    
    
}
