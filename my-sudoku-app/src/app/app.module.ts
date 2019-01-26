import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WeclomePageComponent } from './weclome-page/weclome-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SingleGameComponent } from './single-game/single-game.component';
import { SudokuClassicGameComponent } from './sudoku-classic-game/sudoku-classic-game.component';
import { FriendPageComponent } from './friend-page/friend-page.component';
import { NewUserPageComponent } from './weclome-page/new-user-page/new-user-page.component';
import { FriendsGamePageComponent } from './friends-game-page/friends-game-page.component';
import { SudokuCompetitionGameComponent } from './sudoku-competition-game/sudoku-competition-game.component';
import { SudokuCollaborationGameComponent } from './sudoku-collaboration-game/sudoku-collaboration-game.component';
import { GradePageComponent } from './grade-page/grade-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { CompetitionGradePageComponent } from './grade-page/competition-grade-page/competition-grade-page.component';
import { CollaborationGradePageComponent } from './grade-page/collaboration-grade-page/collaboration-grade-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WatchFriendsComponent } from './friend-page/watch-friends/watch-friends.component';
import { StatusFriendsComponent } from './friend-page/status-friends/status-friends.component';



@NgModule({
  declarations: [
    AppComponent,
    WeclomePageComponent,
    HomePageComponent,
    SingleGameComponent,
    SudokuClassicGameComponent,
    FriendPageComponent,
    NewUserPageComponent,
    FriendsGamePageComponent,
    SudokuCompetitionGameComponent,
    SudokuCollaborationGameComponent,
    GradePageComponent,
    SettingPageComponent,
    CompetitionGradePageComponent,
    CollaborationGradePageComponent,
    PageNotFoundComponent,
    WatchFriendsComponent,
    StatusFriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
