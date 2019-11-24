import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusFriendsComponent } from './status-friends.component';

describe('StatusFriendsComponent', () => {
  let component: StatusFriendsComponent;
  let fixture: ComponentFixture<StatusFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
