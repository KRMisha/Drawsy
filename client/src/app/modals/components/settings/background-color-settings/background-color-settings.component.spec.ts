import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundColorSettingsComponent } from './background-color-settings.component';

describe('BackgroundColorSettingsComponent', () => {
    let component: BackgroundColorSettingsComponent;
    let fixture: ComponentFixture<BackgroundColorSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BackgroundColorSettingsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BackgroundColorSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
