import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideCalligraphyComponent } from './guide-calligraphy.component';

describe('GuideCalligraphyComponent', () => {
  let component: GuideCalligraphyComponent;
  let fixture: ComponentFixture<GuideCalligraphyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideCalligraphyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideCalligraphyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
