import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionGradePageComponent } from './competition-grade-page.component';

describe('CompetitionGradePageComponent', () => {
  let component: CompetitionGradePageComponent;
  let fixture: ComponentFixture<CompetitionGradePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionGradePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionGradePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
