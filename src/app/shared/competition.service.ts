import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Competition } from './Competition';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  boardsRef: AngularFireList<any>;
  boardRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) { }


  //Adding a Table of Competition game
  AddCompetition(board: Competition) {
    this.boardsRef.push({
      from: board.from,
      to: board.to,
      difficulty: board.difficulty,
      boradName: board.boradName,
      chat: board.chat,
      sudokuBoard: board.sudokuBoard,
      done: board.done,
      win: board.win
    })
  }


  //Receiving boards to Competition game
  GetAllCompetitioncList() {
    this.boardsRef = this.db.list('competition-game');
    return this.boardsRef;
  }


  // Delete Competition game Object
  DeleteCompetitione(id: string) {
    this.boardRef = this.db.object('competition-game/' + id);
    this.boardRef.remove();
  }

  //Calculation of the end result of solving the board by
  //time and difficulty level
  calculatePoints(difficulty, sec, min) {
    if (difficulty == 'קל') {
      if ((min == 4 && sec == 0) || min < 4) {
        return 100;
      }
      else if ((min == 7 && sec == 0) || (min >= 4 && min < 7)) {
        return 80;
      }
      else {
        return 50;
      }

    }
    if (difficulty == 'בינוני') {
      if ((min == 10 && sec == 0) || min < 10) {
        return 120;
      }
      else if ((min == 15 && sec == 0) || (min >= 10 && min < 15)) {
        return 90;
      }
      else {
        return 70;
      }

    }
    if (difficulty == 'קשה') {
      if ((min == 20 && sec == 0) || min < 20) {
        return 200;
      }
      else if ((min == 30 && sec == 0) || (min >= 20 && min < 30)) {
        return 140;
      }
      else {
        return 120;
      }

    }
  }



}
