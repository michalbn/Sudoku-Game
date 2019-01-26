import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weclome-page',
  templateUrl: './weclome-page.component.html',
  styleUrls: ['./weclome-page.component.css']
})
export class WeclomePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  Continue_to_home_page()
  {
    //check user

    this.router.navigate(['/home-page']);
  }

  create_new_user()
  {
    this.router.navigate(['/new-user']);
  }



  

}
