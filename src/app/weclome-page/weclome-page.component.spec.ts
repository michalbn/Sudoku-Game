import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeclomePageComponent } from './weclome-page.component';

describe('WeclomePageComponent', () => {
  let component: WeclomePageComponent;
  let fixture: ComponentFixture<WeclomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeclomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeclomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
