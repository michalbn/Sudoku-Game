import { Injectable } from '@angular/core';
import { User } from '../shared/user';  // Student data type interface class
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  valid ;
  usersRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  userRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too
  

  constructor(private db: AngularFireDatabase) { }

    // Create User
    AddUser(user: User) {
      this.usersRef.push({
        nickName: user.nickName
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
  
    // Update User Object
    UpdateStudent(user: User) {
      this.userRef.update({
        nickName: user.nickName
      })
    }
    
    // Delete User Object
    DeleteUser(id: string) { 
      this.userRef = this.db.object('users-list/'+id);
      this.userRef.remove();
    }

    checkNickName(nickName:string)
    {  
        this.GetUsersList().valueChanges().subscribe(collection => {
          for (var i = 0; i < collection.length; i++) 
          {
            if(collection[i].nickName==nickName)
            {
              console.log("collection[i].nickName" + collection[i].nickName)
             this.valid =true;
             break;
            }
            
          }
          this.valid =false;
  
          })
    
    }
    
}
