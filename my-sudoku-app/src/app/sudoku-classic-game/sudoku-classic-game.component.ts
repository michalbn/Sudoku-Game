import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-sudoku-classic-game',
  templateUrl: './sudoku-classic-game.component.html',
  styleUrls: ['./sudoku-classic-game.component.css']
})
export class SudokuClassicGameComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute,public authApi: AuthService) { }

  ngOnInit() {
    if(this.authApi.getSessionStorage()==null)///if session not null
    {
      this.router.navigate(['/']);//go to new-user
    }
    else
    {
      var difficulty = this.route.snapshot.paramMap.get('difficulty')
      if(difficulty==="קל" || difficulty==="בינוני"||difficulty==="קשה")
      {
        console.log(this.route.snapshot.paramMap.get('levelname'))
        //this.router.navigate(['/not-found']);//go to new-user
      }
      else
      {
        this.router.navigate(['/single-game']);//go to new-user
      }

    }

  }

}
