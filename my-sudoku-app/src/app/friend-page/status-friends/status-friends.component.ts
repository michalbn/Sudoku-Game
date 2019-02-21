import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/user';


@Component({
  selector: 'app-status-friends',
  templateUrl: './status-friends.component.html',
  styleUrls: ['./status-friends.component.css']
})
export class StatusFriendsComponent implements OnInit {

  constructor(public authApi: AuthService) { }

  ngOnInit() {

  }

}
