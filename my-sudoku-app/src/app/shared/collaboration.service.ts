import { Injectable } from '@angular/core';
import { AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Collaboration } from './Collaboration';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  boardsCollRef: AngularFireList<any>;    // Reference to Easy - boards, its an Observable
  boardCollRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) { }

          //Adding a Table of Difficulty "Easy" to classic game
          AddCollaboration(shareGame :Collaboration) {
            this.boardsCollRef.push({
              from: shareGame.from,
              to: shareGame.to,
              difficulty: shareGame.difficulty,
              boradName: shareGame.boradName,
              chat: shareGame.chat,
              sudokuBoard: shareGame.sudokuBoard,
              shareBoard: shareGame.shareBoard,
              done:shareGame.done,
              win:shareGame.win,
          })
          }

                //Receiving boards to classic game
      GetAllCollaborationList() {
        this.boardsCollRef = this.db.list('collaboration-game');
         return this.boardsCollRef;
       }

                  // Delete Message Object
    DeleteCollaboration(id: string) { 
      this.boardCollRef = this.db.object('collaboration-game/'+id);
      this.boardCollRef.remove();
    }


    calculatePoints(difficulty,sec,min)
    {
     if(difficulty=='קל')
     {
       if((min==4 && sec==0) || min<4)
       {
         return 70;
       }
       else if((min==7 && sec==0) || (min>=4 && min<7))
       {
         return 50;
       }
       else
       {
         return 30;
       }
       
     }
     if(difficulty=='בינוני')
     {
       if((min==10 && sec==0) || min<10)
       {
         return 80;
       }
       else if((min==15 && sec==0) || (min>=10 && min<15))
       {
         return 60;
       }
       else
       {
         return 40;
       }

     }
     if(difficulty=='קשה')
     {
       if((min==20 && sec==0) || min<20)
       {
         return 150;
       }
       else if((min==30 && sec==0) || (min>=20 && min<30))
       {
         return 100;
       }
       else
       {
         return 80;
       }
      
     }
    }

}
