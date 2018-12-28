import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborationGameComponent } from './collaboration-game.component';

describe('CollaborationGameComponent', () => {
  let component: CollaborationGameComponent;
  let fixture: ComponentFixture<CollaborationGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaborationGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborationGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
