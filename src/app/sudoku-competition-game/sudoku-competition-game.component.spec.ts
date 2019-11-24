import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuCompetitionGameComponent } from './sudoku-competition-game.component';

describe('SudokuCompetitionGameComponent', () => {
  let component: SudokuCompetitionGameComponent;
  let fixture: ComponentFixture<SudokuCompetitionGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuCompetitionGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuCompetitionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
