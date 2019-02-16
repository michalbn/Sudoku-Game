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
  friend: Friend[]=[];

  constructor(private db: AngularFireDatabase,
              private storage:LocalStorageService,
              private sessionSt: SessionStorageService,
              private localSt: LocalStorageService
              ) { }

    // Create User
    AddUser(user: User,login:boolean,friendName :string,status: string) {
      this.usersRef.push({
        nickName: user.nickName,
        password: user.password,
        login: login,
        friendList: {friendName:friendName, status:status}
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
        login: login,
       friendList:user.friendList
       // friendList: {friendName:user.fzz, status:null}
        
      })
    }

    UpdateUserFriend(id: string, user:User,friend: Friend[])
    {
      this.db.object('users-list/'+id).set({
        nickName: user.nickName,
        password: user.password,
        login: user.login,
        friendList:friend
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
