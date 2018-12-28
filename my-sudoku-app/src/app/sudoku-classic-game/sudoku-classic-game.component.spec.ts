import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SudokuClassicGameComponent } from './sudoku-classic-game.component';

describe('SudokuClassicGameComponent', () => {
  let component: SudokuClassicGameComponent;
  let fixture: ComponentFixture<SudokuClassicGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SudokuClassicGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuClassicGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
