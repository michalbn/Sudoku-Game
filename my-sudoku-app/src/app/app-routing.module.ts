import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollaborationGradePageComponent } from './grade-page/collaboration-grade-page/collaboration-grade-page.component';
import { CompetitionGradePageComponent } from './grade-page/competition-grade-page/competition-grade-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { GradePageComponent } from './grade-page/grade-page.component';
import { SudokuCollaborationGameComponent } from './sudoku-collaboration-game/sudoku-collaboration-game.component';
import { SudokuCompetitionGameComponent } from './sudoku-competition-game/sudoku-competition-game.component';
import { FriendsGamePageComponent } from './friends-game-page/friends-game-page.component';
import { FriendPageComponent } from './friend-page/friend-page.component';
import { NewUserPageComponent } from './weclome-page/new-user-page/new-user-page.component';
import { SudokuClassicGameComponent } from './sudoku-classic-game/sudoku-classic-game.component';
import { SingleGameComponent } from './single-game/single-game.component';
import { HomePageComponent } from './home-page/home-page.component';
import { WeclomePageComponent } from './weclome-page/weclome-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WatchFriendsComponent } from './friend-page/watch-friends/watch-friends.component';
import { StatusFriendsComponent } from './friend-page/status-friends/status-friends.component';

const appRoutes: Routes=[
  {path: '', component: WeclomePageComponent},
  {path: 'home-page', component: HomePageComponent},
  {path: 'single-game', component: SingleGameComponent},
  {path: 'classic-game/:difficulty/:levelname', component: SudokuClassicGameComponent},
  {path: 'new-user', component: NewUserPageComponent},
  {path: 'friends-page', component: FriendPageComponent,children:[
    {path: 'watch-friends', component: WatchFriendsComponent},
    {path: 'status-friends', component: StatusFriendsComponent},
  ]},
  {path: 'friends-game-page', component: FriendsGamePageComponent},
  {path: 'competition-game/:game/:from/:to/:difficulty/:levelname', component: SudokuCompetitionGameComponent},
  {path: 'collaboration-game/:game/:from/:to/:difficulty/:levelname', component: SudokuCollaborationGameComponent},
  {path: 'grade-page', component: GradePageComponent,children:[
    {path: 'competition', component: CompetitionGradePageComponent},
    {path: 'collaboration', component: CollaborationGradePageComponent},
  ]},
  {path: 'setting', component: SettingPageComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
