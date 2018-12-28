import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WeclomePageComponent } from './weclome-page/weclome-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SingleGameComponent } from './single-game/single-game.component';
import { SudokuClassicGameComponent } from './sudoku-classic-game/sudoku-classic-game.component';
import { FriendPageComponent } from './friend-page/friend-page.component';
import { NewUserPageComponent } from './new-user-page/new-user-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { FriendsGamePageComponent } from './friends-game-page/friends-game-page.component';
import { CompetitionGameComponent } from './competition-game/competition-game.component';
import { CollaborationGameComponent } from './collaboration-game/collaboration-game.component';
import { SudokuCompetitionGameComponent } from './sudoku-competition-game/sudoku-competition-game.component';
import { SudokuCollaborationGameComponent } from './sudoku-collaboration-game/sudoku-collaboration-game.component';
import { GradePageComponent } from './grade-page/grade-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';

@NgModule({
  declarations: [
    AppComponent,
    WeclomePageComponent,
    HomePageComponent,
    SingleGameComponent,
    SudokuClassicGameComponent,
    FriendPageComponent,
    NewUserPageComponent,
    ForgotPasswordPageComponent,
    FriendsGamePageComponent,
    CompetitionGameComponent,
    CollaborationGameComponent,
    SudokuCompetitionGameComponent,
    SudokuCollaborationGameComponent,
    GradePageComponent,
    SettingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
