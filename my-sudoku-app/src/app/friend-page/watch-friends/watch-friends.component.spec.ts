import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchFriendsComponent } from './watch-friends.component';

describe('WatchFriendsComponent', () => {
  let component: WatchFriendsComponent;
  let fixture: ComponentFixture<WatchFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
