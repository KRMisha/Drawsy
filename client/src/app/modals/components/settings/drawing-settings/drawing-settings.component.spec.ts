import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingSettingsComponent } from './drawing-dimensions-settings.component';

describe('DrawingDimensionsSettingsComponent', () => {
    let component: DrawingSettingsComponent;
    let fixture: ComponentFixture<DrawingSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingSettingsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
