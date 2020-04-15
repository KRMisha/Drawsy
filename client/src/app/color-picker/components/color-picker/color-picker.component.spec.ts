import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from '@app/color-picker/components/color-picker/color-picker.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { ColorService } from '@app/drawing/services/color.service';
import { Color } from '@app/shared/classes/color';
import { BehaviorSubject } from 'rxjs';

// tslint:disable: no-string-literal

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let hueChangedSubject: BehaviorSubject<number>;
    let saturationChangedSubject: BehaviorSubject<number>;
    let valueChangedSubject: BehaviorSubject<number>;
    let alphaChangedSubject: BehaviorSubject<number>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;

    const initialValue = 1;
    const colorStub = {} as Color;
    beforeEach(async(() => {
        hueChangedSubject = new BehaviorSubject<number>(initialValue);
        saturationChangedSubject = new BehaviorSubject<number>(initialValue);
        valueChangedSubject = new BehaviorSubject<number>(initialValue);
        alphaChangedSubject = new BehaviorSubject<number>(initialValue);
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor', 'setColor'], {
            hueChanged$: hueChangedSubject,
            saturationChanged$: saturationChangedSubject,
            valueChanged$: valueChangedSubject,
            alphaChanged$: alphaChangedSubject,
        });
        colorPickerServiceSpyObj.getColor.and.returnValue(colorStub);

        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            providers: [{ provide: ColorService, useValue: colorPickerServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['colorPickerService'] = colorPickerServiceSpyObj;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#set ColorModel should call colorPickerService's setColor", () => {
        const color = {} as Color;
        component.colorModel = color;
        expect(colorPickerServiceSpyObj.setColor).toHaveBeenCalledWith(color);
    });

    it("#ngOnInit should subscribe to colorPickerService's hueChanged, saturationChanged, valueChanged and alphaChanged", async(() => {
        const hueChangedSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        const saturationChangedSpy = spyOn(saturationChangedSubject, 'subscribe').and.callThrough();
        const valueChangedSpy = spyOn(valueChangedSubject, 'subscribe').and.callThrough();
        const alphaChangedSpy = spyOn(alphaChangedSubject, 'subscribe').and.callThrough();

        component.ngOnInit();

        expect(hueChangedSpy).toHaveBeenCalled();
        expect(saturationChangedSpy).toHaveBeenCalled();
        expect(valueChangedSpy).toHaveBeenCalled();
        expect(alphaChangedSpy).toHaveBeenCalled();
    }));

    it('hueChanged subscription should make colorModelChange emit', async(() => {
        component.ngOnInit();
        const emitSpy = spyOn(component.colorModelChange, 'emit');
        hueChangedSubject.next(initialValue);
        expect(emitSpy).toHaveBeenCalledWith(colorStub);
    }));

    it('saturationChanged subscription should make colorModelChange emit', async(() => {
        component.ngOnInit();
        const emitSpy = spyOn(component.colorModelChange, 'emit');
        saturationChangedSubject.next(initialValue);
        expect(emitSpy).toHaveBeenCalledWith(colorStub);
    }));

    it('valueChanged subscription should make colorModelChange emit', async(() => {
        component.ngOnInit();
        const emitSpy = spyOn(component.colorModelChange, 'emit');
        valueChangedSubject.next(initialValue);
        expect(emitSpy).toHaveBeenCalledWith(colorStub);
    }));

    it('alphaChanged subscription should make colorModelChange emit', async(() => {
        component.ngOnInit();
        const emitSpy = spyOn(component.colorModelChange, 'emit');
        valueChangedSubject.next(initialValue);
        expect(emitSpy).toHaveBeenCalledWith(colorStub);
    }));

    it('#ngOnDestroy should unsubscribe from colorChangedSubscription', async(() => {
        const colorChangedSubscriptionSpy = spyOn(component['colorChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(colorChangedSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#onColorPreviewClick should make colorPreviewClicked emit', () => {
        const emitSpy = spyOn(component['colorPreviewClicked'], 'emit');
        component.onColorPreviewClick();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('#get color should forward call to colorPickerService', () => {
        // tslint:disable-next-line: no-unused-expression
        component.color;
        expect(colorPickerServiceSpyObj.getColor).toHaveBeenCalled();
    });
});
