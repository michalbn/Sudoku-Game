import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user-page',
  templateUrl: './new-user-page.component.html',
  styleUrls: ['./new-user-page.component.css']
})
export class NewUserPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  welcome_page()
  {
    this.router.navigate(['/home-page']); 
  }

}
