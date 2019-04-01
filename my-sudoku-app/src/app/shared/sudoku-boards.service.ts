import { Injectable } from '@angular/core';
import { Board } from './Board';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object



@Injectable({
  providedIn: 'root'
})
export class SudokuBoardsService {
  allBoardsRef: AngularFireList<any>;    // Reference to all boards list, its an Observable
  boardsEasyRef: AngularFireList<any>;    // Reference to Easy - boards, its an Observable
  boardsMediumRef: AngularFireList<any>;    // Reference to Medium - boards, its an Observable
  boardsHardRef: AngularFireList<any>;    // Reference to Hard - boards, its an Observable
 // boardRef: AngularFireObject<any>;   
  

  constructor(private db: AngularFireDatabase) { }

      //Adding a Table of Difficulty "Easy"
      AddBoradEasy(board :Board) {
        this.boardsEasyRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }

      //Adding a Table of Difficulty "Medium"
      AddBoradMedium(board :Board) {
        this.boardsMediumRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }

      //Adding a Table of Difficulty "Hard"
      AddBoradHard(board :Board) {
        this.boardsHardRef.push({
          boardName: board.boardName,
          sudoku: board.sudoku,
          rate: board.rate,
          feedback: board.feedback
      })
      }



  
    // Receiving boards "Easy"
    GetBoardsListEasy() {
     this.boardsEasyRef = this.db.list('sudoku-boards/easy');
      return this.boardsEasyRef;
    }

    // Receiving boards "Medium"
    GetBoardsListMedium() {
      this.boardsMediumRef = this.db.list('sudoku-boards/medium');
       return this.boardsMediumRef;
     }

     // Receiving boards "Hard"
     GetBoardsListHard() {
      this.boardsHardRef = this.db.list('sudoku-boards/hard');
       return this.boardsHardRef;
     }

     //Receiving boards
    GetAllBoradsList() {
      this.allBoardsRef = this.db.list('sudoku-boards');
       return this.allBoardsRef;
     }


}
  










