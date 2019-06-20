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

    alertMsg(sdfg)
    {
      console.log("goood")
    //  this.GetMessagesList().snapshotChanges().subscribe(collection => {
      this.Message = [];
      // collection.forEach(item => {
      //   let a = item.payload.toJSON();
      //   if (a["to"] === this.authApi.getSessionStorage() && a["status"] === "hold") {
      //     this.msgid = item.key
      //     this.Message.push(a as message);
      //     return;
      //   }
      //   return
      // })
      console.log(this.Message)
      this.GetMessagesList().snapshotChanges().subscribe(collection => {
        this.Message = [];
        collection.forEach(item => {
          console.log(item)
          let a = item.payload.toJSON();
          if (a["to"] === this.authApi.getSessionStorage() && a["status"] === "hold") {
            this.msgid = item.key
            this.count++
            this.Message.push(a as message);
            return;
          }
        })
        console.log(collection)
        console.log(this.count)
        if(this.count===1 && this.Message.length === 1)
        {
          this.confirmFlag = confirm(this.Message[0].massage);
          console.log(this.confirmFlag)
          console.log(this.Message.length)
          console.log(this.Message)
          if (this.confirmFlag != null)
          {
            if (this.confirmFlag == true)
            {
              //this.delay(300)
              this.conf()
            }
            else if (this.confirmFlag == false)
            {
              if (this.Message.length === 1)
              {
                //this.delay1(1000)
                this.cencel()
              } 
            }
          }
          this.Message=[];
          this.confirmFlag=null;
          return
        }
        else if (this.Message.length >= 1)
        {
          this.af.database.ref('messages-list/').transaction(a => {
            for (var i = 0; i < Object.keys(a).length; i++)
            {
              console.log(Object.keys(a[Object.keys(a)[i]]).length)
                if(Object.keys(a[Object.keys(a)[i]]).length<7)
                {
                  this.DeleteMessage(Object.keys(a)[i])
                  return
                  
                }
            }
            return
          })
            this.confirmFlag = null;
            this.Message = [];
            //this.router.navigate(['/friends-game-page'])
            // if(this.router.url===)
            // {
            //   this._location.back()
            // }
            var path =  this.router.url.substr(1,this.router.url.indexOf('/',1))
            if(path=="competition-game/")
            {
              this._location.back();
              this._location.back();
             
            }
            console.log(path)
            location.reload();
        }
        else
        {
          this.af.database.ref('messages-list/').transaction(ab => {
            if(ab==null)
            {
              this.count=0;
              this.confirmFlag = null;
              this.Message = [];
              return
            }
            this.confirmFlag = null;
            this.Message = [];
            return
          })
        }
        // console.log(this.Message)
        // return
      })
      this.count=0
     console.log(this.count)
      

    //   console.log(this.Message)
      
    //   if (this.Message.length > 1)
    //   {
    //     this.confirmFlag = null;
    //     this.Message = [];
    //     location.reload();
    //   }
    //   else if (this.Message.length === 1)
    //   {
    //     for(var j=0;j<1;j++)
    //     {
    //       console.log(j)
    //       if (this.Message[0].to === this.authApi.getSessionStorage() && this.Message[0].status === "hold") {
    //         this.confirmFlag = confirm(this.Message[0].massage);
    //         console.log(this.confirmFlag)
    //         console.log(this.Message)
  
    //         if (this.confirmFlag != null) {
    //           if (this.Message.length === 1) {
    //             if (this.confirmFlag == true) //exit
    //             {
    //               this.delay(300)
    //               //  this.confirmFlag=null;  
    //             }
    //             else if (this.confirmFlag == false) {
    //               if (this.Message.length === 1) {
    //                 this.delay1(100)
    //               }
    //               else {
    //                 this.Message = []
    //               }
    //               return
    //             }
    //             else {
    //             //  this.ngOnInit()
    //             }
    //           }
    //           else {
    //            // this.ngOnInit()
    //           }
    //         }
  
    //       }

    //     }
    //     console.log(j)
    //     this.confirmFlag = null;
    //     this.Message = [];
    //     return;
    //   }
    //   else
    //   {
    //     this.confirmFlag = null;
    //     this.Message = [];
    //     return;

    //   }
    // })
    // return;
    //   })
    //   return;
    }



    
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => this.conf());
  }

  async delay1(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => this.cencel());
  }

  cencel() {
    if (this.Message.length >= 2) {
      this.Message = [];
      this.confirmFlag = null
      return;
    }
    else if (this.confirmFlag === false && this.Message.length == 1) {
      this.af.database.ref('messages-list/').transaction(ab => {
        if (ab === null) {
          //console.log("empty id"); console.log(ab);
          this.confirmFlag = null;
          this.Message = [];
          return;
        }
        else {
          for (var i = 0; i < Object.keys(ab).length; i++) {
            if (ab[Object.keys(ab)[i]]["to"] === this.authApi.getSessionStorage()) {
              //console.log("exsit id"); console.log(Object.keys(ab)[i]);
              if (this.msgid === Object.keys(ab)[i] && this.confirmFlag === false) {
                this.db.database.ref("messages-list/" + Object.keys(ab)[i] + "/status").set("canceled");
                this.confirmFlag = null;
                this.Message = [];
                return;
              }
              else {
                this.conf()
                this.confirmFlag = null;
                this.Message = [];
                return;
              }
            }

          }
        }
        return
      })
    }
    else if (this.confirmFlag != null && this.Message.length == 1) {
      this.conf()
      this.confirmFlag = null;
      this.Message = [];
      return;
    }

    this.Message = [];
    this.confirmFlag = null
    return;
  }


  conf() {
    if (this.Message.length >= 2) {
      this.Message = [];
      this.confirmFlag = null
      return;
    }

    else if (this.confirmFlag === true && this.Message.length == 1) {
      this.af.database.ref('messages-list/').transaction(ab => {
        if (ab === null) {
         // console.log("empty id"); console.log(ab);
          this.confirmFlag = null;
          this.Message = [];
          // this.ngOnInit()
          return;
        }
        else {
          for (var i = 0; i < Object.keys(ab).length; i++) {
           // console.log("exsit id");
            //console.log(Object.keys(ab)[0]);
            if (this.msgid === Object.keys(ab)[i] && this.confirmFlag === true) {
              this.db.database.ref("messages-list/" + Object.keys(ab)[i] + "/status").set("approved")
              if (ab[Object.keys(ab)[i]]["game"] == "תחרות") {
                this.router.navigate(['/competition-game', ab[Object.keys(ab)[i]]["game"], ab[Object.keys(ab)[i]]["from"], ab[Object.keys(ab)[i]]["to"], ab[Object.keys(ab)[i]]["difficulty"], ab[Object.keys(ab)[i]]["boradName"]]);//go to new-user
                this.Message = [];
                this.confirmFlag = null
                return;
              }
              else {
                this.router.navigate(['/collaboration-game', ab[Object.keys(ab)[i]]["game"], ab[Object.keys(ab)[i]]["from"], ab[Object.keys(ab)[i]]["to"], ab[Object.keys(ab)[i]]["difficulty"], ab[Object.keys(ab)[i]]["boradName"]]);//go to new-user
                this.Message = [];
                this.confirmFlag = null
                return;
              }
            }
          }

        }
        return;
      })
      return

    }
    else if (this.confirmFlag != null && this.Message.length == 1) {
      this.cencel()
      this.Message = [];
      this.confirmFlag = null
      return;
    }

    this.Message = [];
    this.confirmFlag = null
    return;
  }
}
