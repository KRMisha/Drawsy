import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideColorPickerComponent } from './guide-color-picker.component';

describe('GuideColorPickerComponent', () => {
    let component: GuideColorPickerComponent;
    let fixture: ComponentFixture<GuideColorPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuideColorPickerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuideColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
