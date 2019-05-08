import { Injectable } from '@angular/core';
import { Board } from './Board';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object



@Injectable({
  providedIn: 'root'
})
export class SudokuBoardsService {
  allClassicBoardsRef: AngularFireList<any>;    // Reference to all boards list, its an Observable
  boardsEasyRef: AngularFireList<any>;    // Reference to Easy - boards, its an Observable
  boardsMediumRef: AngularFireList<any>;    // Reference to Medium - boards, its an Observable
  boardsHardRef: AngularFireList<any>;    // Reference to Hard - boards, its an Observable

  allCompetitionBoardsRef: AngularFireList<any>;    // Reference to all boards list, its an Observable
  boardsEasy_CompetitionRef: AngularFireList<any>;    // Reference to Easy - boards, its an Observable
  boardsMedium_CompetitionRef: AngularFireList<any>;    // Reference to Medium - boards, its an Observable
  boardsHard_CompetitionRef: AngularFireList<any>;    // Reference to Hard - boards, its an Observable

  allCollaborationBoardsRef: AngularFireList<any>;    // Reference to all boards list, its an Observable
  boardsEasy_CollaborationRef: AngularFireList<any>;    // Reference to Easy - boards, its an Observable
  boardsMedium_CollaborationRef: AngularFireList<any>;    // Reference to Medium - boards, its an Observable
  boardsHard_CollaborationRef: AngularFireList<any>;    // Reference to Hard - boards, its an Observable

  allBoardsRef: AngularFireList<any>;    // Reference to all boards list, its an Observable


  
  

  constructor(private db: AngularFireDatabase) { }

      //Adding a Table of Difficulty "Easy" to classic game
      AddBoradEasy(board :Board) {
        this.boardsEasyRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }

      //Adding a Table of Difficulty "Medium" to classic game
      AddBoradMedium(board :Board) {
        this.boardsMediumRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }

      //Adding a Table of Difficulty "Hard" to classic game
      AddBoradHard(board :Board) {
        this.boardsHardRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }

      /////////////////////////////////////////////////////////////

            //Adding a Table of Difficulty "Easy" to Competition game
            AddCompetitionBoradEasy(board :Board) {
              this.boardsEasy_CompetitionRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }
      
            //Adding a Table of Difficulty "Medium" to Competition game
            AddCompetitionBoradMedium(board :Board) {
              this.boardsMedium_CompetitionRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }
      
            //Adding a Table of Difficulty "Hard" to Competition game
            AddCompetitionBoradHard(board :Board) {
              this.boardsHard_CompetitionRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }


      /////////////////////////////////////////////////////////////

                  //Adding a Table of Difficulty "Easy" to Collaboration game
            AddCollaborationBoradEasy(board :Board) {
              this.boardsEasy_CollaborationRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }
      
            //Adding a Table of Difficulty "Medium" to Collaboration game
            AddCollaborationBoradMedium(board :Board) {
              this.boardsMedium_CollaborationRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }
      
            //Adding a Table of Difficulty "Hard" to Collaboration game
            AddCollaborationBoradHard(board :Board) {
              this.boardsHard_CollaborationRef.push({
                boardName: board.boardName,
                sudoku: board.sudoku,
                rate: board.rate,
                feedback: board.feedback
            })
            }

      /////////////////////////////////////////////////////////////

  
    // Receiving boards "Easy" to classic game
    GetBoardsListEasy() {
     this.boardsEasyRef = this.db.list('sudoku-boards/classic/easy');
      return this.boardsEasyRef;
    }

    // Receiving boards "Medium" to classic game
    GetBoardsListMedium() {
      this.boardsMediumRef = this.db.list('sudoku-boards/classic/medium');
       return this.boardsMediumRef;
     }

     // Receiving boards "Hard" to classic game
     GetBoardsListHard() {
      this.boardsHardRef = this.db.list('sudoku-boards/classic/hard');
       return this.boardsHardRef;
     }

     //Receiving boards to classic game
    GetAllClassicBoradsList() {
      this.allClassicBoardsRef = this.db.list('sudoku-boards/classic');
       return this.allClassicBoardsRef;
     }

     ///////////////////////////////////////////////////////
         // Receiving boards "Easy" to Competition game
    GetBoardsList_CompetitionEasy() {
      this.boardsEasy_CompetitionRef = this.db.list('sudoku-boards/competition/easy');
       return this.boardsEasy_CompetitionRef ;
     }
 
     // Receiving boards "Medium" to Competition game
     GetBoardsList_CompetitionMedium() {
       this.boardsMedium_CompetitionRef = this.db.list('sudoku-boards/competition/medium');
        return this.boardsMedium_CompetitionRef;
      }
 
      // Receiving boards "Hard" to Competition game
      GetBoardsList_CompetitionHard() {
       this.boardsHard_CompetitionRef = this.db.list('sudoku-boards/competition/hard');
        return this.boardsHard_CompetitionRef;
      }
 
      //Receiving boards to Competition game
     GetAllCompetitionBoradsList() {
       this.allCompetitionBoardsRef= this.db.list('sudoku-boards/competition');
        return this.allCompetitionBoardsRef;
      }

      /////////////////////////////////////////////////////////////////////

          // Receiving boards "Easy" to Collaboration game
    GetBoardsList_CollaborationEasy() {
      this.boardsEasy_CollaborationRef = this.db.list('sudoku-boards/collaboration/easy');
       return this.boardsEasy_CollaborationRef;
     }
 
     // Receiving boards "Medium" to Collaboration game
     GetBoardsList_CollaborationMedium() {
       this.boardsMedium_CollaborationRef = this.db.list('sudoku-boards/collaboration/medium');
        return this.boardsMedium_CollaborationRef;
      }
 
      // Receiving boards "Hard" to Collaboration game
      GetBoardsList_CollaborationHard() {
       this.boardsHard_CollaborationRef = this.db.list('sudoku-boards/collaboration/hard');
        return this.boardsHard_CollaborationRef;
      }
 
      //Receiving boards to Collaboration game
     GetCollaborationBoradsList() {
       this.allCollaborationBoardsRef = this.db.list('sudoku-boards/collaboration');
        return this.allClassicBoardsRef;
      }

      /////////////////////////////////////////////////////////////////////////////

      GetAllBoradsList() {
        this.allBoardsRef = this.db.list('sudoku-boards');
         return this.allBoardsRef;
       }


}
  










