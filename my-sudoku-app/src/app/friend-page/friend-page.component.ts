import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friend-page',
  templateUrl: './friend-page.component.html',
  styleUrls: ['./friend-page.component.css']
})
export class FriendPageComponent implements OnInit,DoCheck {
  friendPage = false;
  path: string;
  constructor(private router : Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngDoCheck()//after any change meybe subscribe video 11
  {
    
    this.path = this.router.routerState.snapshot.url
    if (this.path == "/friends-page")
    {
      this.friendPage=true;
    }
    else
    {
      this.friendPage=false;
    }
  }

}
