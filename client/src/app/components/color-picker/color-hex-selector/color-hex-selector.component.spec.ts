import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ColorHexSelectorComponent } from './color-hex-selector.component';

describe('ColorHexSelectorComponent', () => {
    let component: ColorHexSelectorComponent;
    let fixture: ComponentFixture<ColorHexSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorHexSelectorComponent],
            imports: [MatFormFieldModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
