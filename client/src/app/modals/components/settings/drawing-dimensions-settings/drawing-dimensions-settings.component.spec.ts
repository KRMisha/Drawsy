import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingDimensionsSettingsComponent } from './drawing-dimensions-settings.component';

describe('DrawingDimensionsSettingsComponent', () => {
  let component: DrawingDimensionsSettingsComponent;
  let fixture: ComponentFixture<DrawingDimensionsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingDimensionsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingDimensionsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
