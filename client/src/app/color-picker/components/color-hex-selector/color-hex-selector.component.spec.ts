import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ColorHexSelectorComponent } from '@app/color-picker/components/color-hex-selector/color-hex-selector.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Subject } from 'rxjs';

describe('ColorHexSelectorComponent', () => {
    let component: ColorHexSelectorComponent;
    let colorPickerSpyObj: jasmine.SpyObj<ColorPickerService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorChangedSubject: Subject<Color>;

    beforeEach(async(() => {
        colorChangedSubject = new Subject<Color>();
        colorPickerSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor', 'setColor'], {
            colorChanged$: colorChangedSubject,
        });
        colorSpyObj = jasmine.createSpyObj('Color', ['getHex']);
        colorSpyObj.getHex.and.returnValue('000000');
        colorPickerSpyObj.getColor.and.returnValue(colorSpyObj);

        TestBed.configureTestingModule({
            declarations: [ColorHexSelectorComponent],
            providers: [{ provide: ColorPickerService, useValue: colorPickerSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        const fixture = TestBed.createComponent(ColorHexSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('#set hex should update the form values', () => {
    //     spyOn(component.hexRgb, 'setValue').and.callThrough();
    //     spyOn(component.hexRed, 'setValue').and.callThrough();
    //     spyOn(component.hexGreen, 'setValue').and.callThrough();
    //     spyOn(component.hexBlue, 'setValue').and.callThrough();
    //     component.hex = '123456';
    //     expect(component.hexRgb.setValue).toHaveBeenCalled();
    //     expect(component.hexRed.setValue).toHaveBeenCalled();
    //     expect(component.hexGreen.setValue).toHaveBeenCalled();
    //     expect(component.hexBlue.setValue).toHaveBeenCalled();
    // });

    // it('#updateColorHex should emit a color change if the hex is valid', () => {
    //     component.hexRgb.setValue('123456');
    //     component.updateColorHex();
    //     expect(component.colorChanged.emit).toHaveBeenCalled();
    // });

    // it('#updateColorHex should not emit a color change if the hex is invalid', () => {
    //     component.hexRgb.setValue('a');
    //     component.updateColorHex();
    //     expect(component.colorChanged.emit).not.toHaveBeenCalled();
    // });

    // it('#updateColorRgb should emit a color change if the hex is valid', () => {
    //     component.hexRed.setValue('12');
    //     component.hexGreen.setValue('34');
    //     component.hexBlue.setValue('56');
    //     component.updateColorRgb();
    //     expect(component.colorChanged.emit).toHaveBeenCalled();
    // });

    // it('#updateColorRgb should not emit a color change if the hex is invalid', () => {
    //     component.hexRed.setValue('qw');
    //     component.hexGreen.setValue('er');
    //     component.hexBlue.setValue('ty');
    //     component.updateColorRgb();
    //     expect(component.colorChanged.emit).not.toHaveBeenCalled();
    // });

    // it('#swapModes should change the bool isHex', () => {
    //     component.swapMode({ preventDefault: () => {} } as MouseEvent); // tslint:disable-line: no-empty
    //     expect(component.isHex).toEqual(false);
    //     component.swapMode({ preventDefault: () => {} } as MouseEvent); // tslint:disable-line: no-empty
    //     expect(component.isHex).toEqual(true);
    // });
});
