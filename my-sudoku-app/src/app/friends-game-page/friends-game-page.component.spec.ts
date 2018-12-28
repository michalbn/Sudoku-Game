import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsGamePageComponent } from './friends-game-page.component';

describe('FriendsGamePageComponent', () => {
  let component: FriendsGamePageComponent;
  let fixture: ComponentFixture<FriendsGamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsGamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
