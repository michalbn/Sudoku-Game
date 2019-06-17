import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  messageRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too


  constructor(private db: AngularFireDatabase) { }


    // Create Message
    AddMessage(message: message) {
      this.messagesRef.push({
        from:message.from,
        to:message.to,
        massage:message.massage,
        difficulty:message.difficulty,
        boradName:message.boradName,
        game:message.game,
        status:message.status
      })
    }


    // Fetch Single Message Object
    GetMessage(id: string) {
      this.messageRef = this.db.object('messages-list/' + id);
      return this.messageRef;
    }

  // Fetch Messages List
  GetMessagesList() {
    this.messagesRef = this.db.list('messages-list');
    return this.messagesRef;
  }
    
    // Delete Message Object
    DeleteMessage(id: string) { 
      this.messageRef = this.db.object('messages-list/'+id);
      this.messageRef.remove();
    }
}
