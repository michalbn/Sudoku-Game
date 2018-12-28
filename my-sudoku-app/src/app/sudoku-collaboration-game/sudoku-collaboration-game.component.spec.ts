import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuCollaborationGameComponent } from './sudoku-collaboration-game.component';

describe('SudokuCollaborationGameComponent', () => {
  let component: SudokuCollaborationGameComponent;
  let fixture: ComponentFixture<SudokuCollaborationGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuCollaborationGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuCollaborationGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
