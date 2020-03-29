import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ColorHexSelectorComponent } from '@app/color-picker/components/color-hex-selector/color-hex-selector.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ColorHexSelectorComponent', () => {
    let component: ColorHexSelectorComponent;
    let hexCombinedRgbFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let hexRedFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let hexGreenFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let hexBlueFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let hexSelectorFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let colorPickerSpyObj: jasmine.SpyObj<ColorPickerService>;
    let colorSpyObj: jasmine.SpyObj<Color>;

    let hexCombinedRbgChangedSubject: Subject<any>;
    let hexRedChangedSubject: Subject<any>;
    let hexGreenChangedSubject: Subject<any>;
    let hexBlueChangedSubject: Subject<any>;
    let hueChangedSubject: Subject<number>;
    let saturationChangedSubject: Subject<number>;
    let valueChangedSubject: Subject<number>;
    let alphaChangedSubject: Subject<number>;

    beforeEach(async(() => {
        hexCombinedRbgChangedSubject = new Subject<any>();
        hexRedChangedSubject = new Subject<any>();
        hexGreenChangedSubject = new Subject<any>();
        hexBlueChangedSubject = new Subject<any>();
        hexCombinedRgbFormControlSpyObj = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: hexCombinedRbgChangedSubject,
            value: '000000',
        });
        hexRedFormControlSpyObj = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: hexRedChangedSubject,
            value: '00',
        });
        hexGreenFormControlSpyObj = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: hexGreenChangedSubject,
            value: '00',
        });
        hexBlueFormControlSpyObj = jasmine.createSpyObj('FormControl', ['setValue', 'markAsTouched'], {
            valid: true,
            valueChanges: hexBlueChangedSubject,
            value: '00',
        });
        hexSelectorFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                hexCombinedRgb: hexCombinedRgbFormControlSpyObj,
                hexRed: hexRedFormControlSpyObj,
                hexGreen: hexGreenFormControlSpyObj,
                hexBlue: hexBlueFormControlSpyObj,
            },
        });

        hueChangedSubject = new Subject<number>();
        saturationChangedSubject = new Subject<number>();
        valueChangedSubject = new Subject<number>();
        alphaChangedSubject = new Subject<number>();
        colorPickerSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor', 'setColor'], {
            hueChanged$: hueChangedSubject,
            saturationChanged$: saturationChangedSubject,
            valueChanged$: valueChangedSubject,
            alphaChanged$: alphaChangedSubject,
            alpha: 1,
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
        component.hexSelectorFormGroup = hexSelectorFormGroupSpyObj;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should subscribe to all the changes of the colorPickerService', () => {
        const hueChangedSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        const saturationChangedSpy = spyOn(saturationChangedSubject, 'subscribe').and.callThrough();
        const valueChangedSpy = spyOn(valueChangedSubject, 'subscribe').and.callThrough();
        const alphaChangedSpy = spyOn(alphaChangedSubject, 'subscribe').and.callThrough();

        component.ngOnInit();

        expect(hueChangedSpy).toHaveBeenCalled();
        expect(saturationChangedSpy).toHaveBeenCalled();
        expect(valueChangedSpy).toHaveBeenCalled();
        expect(alphaChangedSpy).toHaveBeenCalled();
    });

    it('#ngOnInit should subscribe to all the formControls valueChanges', () => {
        const hexCombinedRgbChangedSpy = spyOn(hexCombinedRbgChangedSubject, 'subscribe').and.callThrough();
        const hexRedChangedSpy = spyOn(hexRedChangedSubject, 'subscribe').and.callThrough();
        const hexGreenChangedSpy = spyOn(hexGreenChangedSubject, 'subscribe').and.callThrough();
        const hexBlueChangedSpy = spyOn(hexBlueChangedSubject, 'subscribe').and.callThrough();

        component.ngOnInit();

        expect(hexCombinedRgbChangedSpy).toHaveBeenCalled();
        expect(hexRedChangedSpy).toHaveBeenCalled();
        expect(hexGreenChangedSpy).toHaveBeenCalled();
        expect(hexBlueChangedSpy).toHaveBeenCalled();
    });

    it('colorService subscriptions should call #updateAll', () => {
        const updateAllSpy = spyOn<any>(component, 'updateAll').and.callThrough();
        hueChangedSubject.next();
        saturationChangedSubject.next();
        valueChangedSubject.next();
        alphaChangedSubject.next();
        expect(updateAllSpy).toHaveBeenCalledTimes(4);
    });

    it('hexCombinedRgb valueChanges subscription should call #updateHexRgbComponents and #updateColorPicker', () => {
        const updateHexRgbSpy = spyOn<any>(component, 'updateHexRgbComponents').and.callThrough();
        const updateColorPickerSpy = spyOn<any>(component, 'updateColorPicker').and.callThrough();
        component.ngOnInit();
        hexCombinedRbgChangedSubject.next();
        expect(updateHexRgbSpy).toHaveBeenCalled();
        expect(updateColorPickerSpy).toHaveBeenCalled();
    });

    it('hexRed valueChanges should call #updateHexCombinedRgb and #updateColorPicker', () => {
        const updateHexCombinedRgbSpy = spyOn<any>(component, 'updateHexCombinedRgb').and.callThrough();
        const updateColorPickerSpy = spyOn<any>(component, 'updateColorPicker').and.callThrough();
        component.ngOnInit();
        hexRedChangedSubject.next();
        expect(updateHexCombinedRgbSpy).toHaveBeenCalled();
        expect(updateColorPickerSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from all the subscriptions', () => {
        const colorChangedSubSpy = spyOn(component['colorChangedSubscription'], 'unsubscribe');
        const hexCombinedRgbChangedSubSpy = spyOn(component['hexCombinedRgbChangedSubscription'], 'unsubscribe');
        const hexRgbComponentChangedSubSpy = spyOn(component['hexRgbComponentChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(colorChangedSubSpy).toHaveBeenCalled();
        expect(hexCombinedRgbChangedSubSpy).toHaveBeenCalled();
        expect(hexRgbComponentChangedSubSpy).toHaveBeenCalled();
    });

    it('#swapMode should invert the value of isCombinedHex', () => {
        const event = {} as MouseEvent;
        component.isCombinedHex = true;
        component.swapMode(event);
        expect(component.isCombinedHex).toEqual(false);
        component.swapMode(event);
        expect(component.isCombinedHex).toEqual(true);
    });

    it("#updateColorPicker should not call colorPickerService's setColor", () => {
        const invalidHexCombinedrgbFormControlSpyObj = jasmine.createSpyObj('FormControl', [], {
            valid: false,
        });
        const invalidHexSelectorFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                hexCombinedRgb: invalidHexCombinedrgbFormControlSpyObj,
            },
        });
        component.hexSelectorFormGroup = invalidHexSelectorFormGroupSpyObj;
        component['updateColorPicker']();
        expect(colorPickerSpyObj.setColor).not.toHaveBeenCalled();
    });
});
