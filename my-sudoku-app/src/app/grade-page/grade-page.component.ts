import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-grade-page',
  templateUrl: './grade-page.component.html',
  styleUrls: ['./grade-page.component.css']
})
export class GradePageComponent implements OnInit,DoCheck {
  gradePage = false;
  path : string;
  constructor(private router : Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngDoCheck()//after any change
  {
    
    this.path = this.router.routerState.snapshot.url
    if (this.path == "/grade-page")
    {
      this.gradePage=true;
    }
    else
    {
      this.gradePage=false;
    }
  }

}
