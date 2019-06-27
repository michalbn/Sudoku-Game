import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { message } from './message';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  messageRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too

  Message: message[]
  msgid
  confirmFlag
  count=0



  constructor(private db: AngularFireDatabase,public authApi: AuthService,
    private router: Router,private af: AngularFireDatabase, private _location : Location) { }


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

    alertMsg(component)
    {
      console.log(component)
      console.log(this.router.url);
      this.Message = [];
      if(component===this.router.url)
      {
        this.GetMessagesList().snapshotChanges().subscribe(collection => {
          if(component!== null && component===this.router.url)
          {
            console.log(component)
            console.log(this.router.url);
            this.Message = [];
            collection.forEach(item => {
              let a = item.payload.toJSON();
              if (a["to"] === this.authApi.getSessionStorage() && a["status"] === "hold")
              {
                this.msgid = item.key
               // this.count++
                this.Message.push(a as message);
                return;
              }
            })
            console.log(this.Message)
            if(this.Message.length===0)
            {
              var modal5 = document.getElementById("myModal5");
              if(modal5!=null)
              {
                modal5.style.display = "none";
                
              }
              return;
            }
            else if(this.Message.length>1)
            {
              console.log("error")
              this.DeleteMessage(this.msgid)
              return;
            }
            else if(this.Message.length===1) 
            {
              var modal5 = document.getElementById("myModal5");
              if(modal5!=null)
              {
                modal5.style.display = "block";
                
              }
              return;
            }
            component=null;
          }
          component=null;
          return;
        })

      }
    }

    conf()
    {
      console.log("koko")
      var modal5 = document.getElementById("myModal5");
      if(modal5!=null)
      {
        modal5.style.display = "none";
        
      }
      this.db.database.ref("messages-list/" + this.msgid + "/status").set("approved")
      if(this.Message[0].game==="תחרות")
      {
        this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
        this.DeleteMessage(this.msgid)
        this.Message=[];
        return; 
      }
      else
      {
        this.router.navigate(['/collaboration-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);//go to new-user
        this.DeleteMessage(this.msgid)
        this.Message=[];
        return;
      }

    }

    cencel()
    {
      var modal5 = document.getElementById("myModal5");
      if(modal5!=null)
      {
        modal5.style.display = "none";
        
      }
      this.db.database.ref("messages-list/" + this.msgid + "/status").set("canceled")

    }

  
}
