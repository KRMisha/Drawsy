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
        spyOn(component.colorChanged, 'emit');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#set hex should update the form values', () => {
        spyOn(component.hexRgb, 'setValue').and.callThrough();
        spyOn(component.hexRed, 'setValue').and.callThrough();
        spyOn(component.hexGreen, 'setValue').and.callThrough();
        spyOn(component.hexBlue, 'setValue').and.callThrough();
        component.hex = '123456';
        expect(component.hexRgb.setValue).toHaveBeenCalled();
        expect(component.hexRed.setValue).toHaveBeenCalled();
        expect(component.hexGreen.setValue).toHaveBeenCalled();
        expect(component.hexBlue.setValue).toHaveBeenCalled();
    });

    it('#updateColorHex should emit a color change if the hex is valid', () => {
        component.hexRgb.setValue('123456');
        component.updateColorHex();
        expect(component.colorChanged.emit).toHaveBeenCalled();
    });

    it('#updateColorHex should not emit a color change if the hex is invalid', () => {
        component.hexRgb.setValue('a');
        component.updateColorHex();
        expect(component.colorChanged.emit).not.toHaveBeenCalled();
    });

    it('#updateColorRgb should emit a color change if the hex is valid', () => {
        component.hexRed.setValue('12');
        component.hexGreen.setValue('34');
        component.hexBlue.setValue('56');
        component.updateColorRgb();
        expect(component.colorChanged.emit).toHaveBeenCalled();
    });

    it('#updateColorRgb should not emit a color change if the hex is invalid', () => {
        component.hexRed.setValue('qw');
        component.hexGreen.setValue('er');
        component.hexBlue.setValue('ty');
        component.updateColorRgb();
        expect(component.colorChanged.emit).not.toHaveBeenCalled();
    });

    it('#swapModes should change the bool isHex', () => {
        component.swapMode({ preventDefault() {} } as MouseEvent); // tslint:disable: no-empty
        expect(component.isHex).toEqual(false);
        component.swapMode({ preventDefault() {} } as MouseEvent); // tslint:disable: no-empty
        expect(component.isHex).toEqual(true);
    });
});
