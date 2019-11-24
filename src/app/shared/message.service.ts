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
  messagesRef: AngularFireList<any>;    
  messageRef: AngularFireObject<any>;   

  Message: message[]//Message request
  msgid//message id

  constructor(private db: AngularFireDatabase,public authApi: AuthService,
    private router: Router,private af: AngularFireDatabase, private _location : Location) { }


    // Add Message
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

    //Send an invitation to the game
    alertMsg(component)
    {
      this.Message = [];
      if(component===this.router.url)
      {
        this.GetMessagesList().snapshotChanges().subscribe(collection => {
          if(component!== null && component===this.router.url)
          {
            this.Message = [];
              collection.forEach(item => {
              let a = item.payload.toJSON();
              if (a["to"] === this.authApi.getSessionStorage() && a["status"] === "hold")
              {
                this.msgid = item.key//צmessage id
                this.Message.push(a as message);//Messages list
                return;
              }
            })
            //If there are no messages
            if(this.Message.length===0)
            {
              var modal5 = document.getElementById("myModal5");
              if(modal5!=null)
              {
                modal5.style.display = "none";
              }
              return;
            }
            //If there is more than one message
            else if(this.Message.length>1)
            {
              this.DeleteMessage(this.msgid)
              return;
            }
            //If there is one message
            else if(this.Message.length===1) 
            {
              //Display it to the user
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
      //If the user has accepted the invitation
      var modal5 = document.getElementById("myModal5");
      if(modal5!=null)
      {
        modal5.style.display = "none";
        
      }
      //Go to the desired game
      this.db.database.ref("messages-list/" + this.msgid + "/status").set("approved")
      if(this.Message[0].game==="תחרות")
      {
        this.router.navigate(['/competition-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);
        this.DeleteMessage(this.msgid)
        this.Message=[];
        return; 
      }
      else
      {
        this.router.navigate(['/collaboration-game',this.Message[0].game,this.Message[0].from,this.Message[0].to,this.Message[0].difficulty,this.Message[0].boradName]);
        this.DeleteMessage(this.msgid)
        this.Message=[];
        return;
      }

    }

    cencel()
    //If the player has refused the request
    {
      var modal5 = document.getElementById("myModal5");
      if(modal5!=null)
      {
        modal5.style.display = "none";
        
      }
      this.db.database.ref("messages-list/" + this.msgid + "/status").set("canceled")

    }

  
}
