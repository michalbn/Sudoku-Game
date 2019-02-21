import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    document.getElementById("demo").style.color="black"
  }

  play()
  {
    this.router.navigate(['/classic-game']);//go to new-user
  }

  mark()
  {
    if(document.getElementById("demo").style.color=="black")
      console.log( document.getElementById("demo").style.color="red")
    else
    {
      console.log( document.getElementById("demo").style.color="black")
    }
  }

}
