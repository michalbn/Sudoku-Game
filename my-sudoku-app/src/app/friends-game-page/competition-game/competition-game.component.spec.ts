import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionGameComponent } from './competition-game.component';

describe('CompetitionGameComponent', () => {
  let component: CompetitionGameComponent;
  let fixture: ComponentFixture<CompetitionGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
