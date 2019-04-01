import { TestBed } from '@angular/core/testing';

import { SudokuBoardsService } from './sudoku-boards.service';

describe('SudokuBoardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SudokuBoardsService = TestBed.get(SudokuBoardsService);
    expect(service).toBeTruthy();
  });
});
