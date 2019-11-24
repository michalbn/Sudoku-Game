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

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

// Reactive Form Module
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Import below modules for NGX Toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// NGX Pagination
import { NgxPaginationModule } from 'ngx-pagination';


//SessionStorage
import {NgxWebstorageModule} from 'ngx-webstorage';

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
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'my-sudoku-app'), // Main Angular fire module 
    AngularFireDatabaseModule,  // Firebase database module 
    ReactiveFormsModule, // Reactive forms module,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() ,// ToastrModule added
    NgxPaginationModule , // Include it in imports array
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
