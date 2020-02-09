import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorHexSelectorComponent } from './color-hex-selector.component';

describe('ColorHexSelectorComponent', () => {
    let component: ColorHexSelectorComponent;
    let fixture: ComponentFixture<ColorHexSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorHexSelectorComponent],
            imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, BrowserAnimationsModule],
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
