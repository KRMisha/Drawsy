import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorHexSelectorComponent } from './color-hex-selector.component';

describe('ColorHexSelectorComponent', () => {
    let component: ColorHexSelectorComponent;
    let fixture: ComponentFixture<ColorHexSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorHexSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorHexSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
