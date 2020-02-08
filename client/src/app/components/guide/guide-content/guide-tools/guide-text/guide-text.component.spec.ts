import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideTextComponent } from './guide-text.component';

describe('GuideTextComponent', () => {
  let component: GuideTextComponent;
  let fixture: ComponentFixture<GuideTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
