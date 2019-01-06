import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborationGradePageComponent } from './collaboration-grade-page.component';

describe('CollaborationGradePageComponent', () => {
  let component: CollaborationGradePageComponent;
  let fixture: ComponentFixture<CollaborationGradePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaborationGradePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborationGradePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
