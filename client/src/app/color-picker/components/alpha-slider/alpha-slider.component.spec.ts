import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaSliderComponent } from '@app/color-picker/components/alpha-slider/alpha-slider.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { Subject } from 'rxjs';

// tslint:disable: max-line-length
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('AlphaSliderComponent', () => {
    let component: AlphaSliderComponent;
    let fixture: ComponentFixture<AlphaSliderComponent>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;

    let hueSubject: Subject<number>;
    let saturationSubject: Subject<number>;
    let valueSubject: Subject<number>;
    let alphaSubject: Subject<number>;

    beforeEach(async(() => {
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbString', 'toRgbaString', 'clone'], {
            red: 200,
            green: 200,
            blue: 200,
            alpha: 1,
        });
        colorSpyObj.toRgbString.and.returnValue('rgb(200, 200, 200)');
        colorSpyObj.toRgbaString.and.returnValue('rgba(200, 200, 200, 1)');
        colorSpyObj.clone.and.returnValue(colorSpyObj);

        hueSubject = new Subject<number>();
        saturationSubject = new Subject<number>();
        valueSubject = new Subject<number>();
        alphaSubject = new Subject<number>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor'], {
            alpha: 1,
            hueChanged$: hueSubject,
            saturationChanged$: saturationSubject,
            valueChanged$: valueSubject,
            alphaChanged$: alphaSubject,
        });
        colorPickerServiceSpyObj.getColor.and.returnValue(colorSpyObj);

        TestBed.configureTestingModule({
            declarations: [AlphaSliderComponent],
            providers: [{ provide: ColorPickerService, useValue: colorPickerServiceSpyObj }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlphaSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngAfterViewInit should subscribe to colorPickerService's hueChanged, saturationChanged, valueChanged and alphaChanged as well as initiate the context", () => {
        const contextMock = {} as CanvasRenderingContext2D;
        component['context'] = contextMock;
        const hueSpy = spyOn(hueSubject, 'subscribe');
        const saturationSpy = spyOn(saturationSubject, 'subscribe');
        const valueSpy = spyOn(valueSubject, 'subscribe');
        const alphaSpy = spyOn(alphaSubject, 'subscribe');
        component.ngAfterViewInit();
        expect(component['context']).not.toEqual(contextMock);
        expect(hueSpy).toHaveBeenCalled();
        expect(saturationSpy).toHaveBeenCalled();
        expect(valueSpy).toHaveBeenCalled();
        expect(alphaSpy).toHaveBeenCalled();
    });

    it('subscriptions should only call #draw once and update the slider position', async(() => {
        component['sliderPosition'] = 0;
        const drawSpy = spyOn<any>(component, 'draw').and.callThrough();
        hueSubject.next();
        saturationSubject.next();
        valueSubject.next();
        alphaSubject.next();
        expect(drawSpy).toHaveBeenCalledTimes(1);
        expect(component['sliderPosition']).not.toEqual(0);
    }));

    it('#ngOnDestroy should unsubscribe from all the subscriptions', () => {
        const unsubscribeSpy = spyOn(component['colorChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should call #updateAlpha if the leftMouseButton is down', () => {
        component['isLeftMouseButtonDown'] = true;
        const updateAlphaSpy = spyOn<any>(component, 'updateAlpha').and.callThrough();
        const event = { clientX: 4 } as MouseEvent;
        component.onMouseMove(event);
        expect(updateAlphaSpy).toHaveBeenCalledWith(event);
    });

    it("#onMouseMove should not call #updateAlpha if the leftMouseButton isn't down", () => {
        component['isLeftMouseButtonDown'] = false;
        const updateAlphaSpy = spyOn<any>(component, 'updateAlpha');
        const event = { clientX: 4 } as MouseEvent;
        component.onMouseMove(event);
        expect(updateAlphaSpy).not.toHaveBeenCalledWith(event);
    });

    it('#onMouseDown should set isLeftMouseButtonDown to true and call #updateAlpha if the mouse is inside the slider', () => {
        component['isMouseInside'] = true;
        component['isLeftMouseButtonDown'] = false;
        const updateAlphaSpy = spyOn<any>(component, 'updateAlpha').and.callThrough();
        const event = { button: MouseButton.Left, clientX: 6 } as MouseEvent;
        component.onMouseDown(event);
        expect(component['isLeftMouseButtonDown']).toEqual(true);
        expect(updateAlphaSpy).toHaveBeenCalledWith(event);
    });

    it('#onMouseDown should not set isLeftMouseButtonDown to true and should not call #updateAlpha if the mouse is not inside the slider', () => {
        component['isMouseInside'] = false;
        component['isLeftMouseButtonDown'] = false;
        const updateAlphaSpy = spyOn<any>(component, 'updateAlpha');
        const event = { clientX: 6 } as MouseEvent;
        component.onMouseDown(event);
        expect(component['isLeftMouseButtonDown']).toEqual(false);
        expect(updateAlphaSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should set isLeftMouseButtonDown to false', () => {
        component['isLeftMouseButtonDown'] = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(false);
    });

    it('#onMouseUp should not set isLeftMouseButtonDown to false if the button pressed is not the left mouse button', () => {
        component['isLeftMouseButtonDown'] = true;
        component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(true);
    });

    it("#onTouchMove should call #onMouseMove using TouchService's getMouseEventFromTouchEvent", () => {
        const onMouseMoveSpy = spyOn(component, 'onMouseMove');
        const expectedParam = {} as MouseEvent;
        const touchServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent').and.returnValue(expectedParam);
        const event = {} as TouchEvent;
        component.onTouchMove(event);
        expect(touchServiceSpy).toHaveBeenCalledWith(event);
        expect(onMouseMoveSpy).toHaveBeenCalledWith(expectedParam);
    });

    it("#onTouchStart should call #onMouseEnter and #onMouseDown using TouchService's getMouseEventFromTouchEvent", () => {
        const onMouseEnterSpy = spyOn(component, 'onMouseEnter');
        const onMouseDownSpy = spyOn(component, 'onMouseDown');
        const expectedParam = {} as MouseEvent;
        const touchServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent').and.returnValue(expectedParam);
        const event = {} as TouchEvent;
        component.onTouchStart(event);
        expect(onMouseEnterSpy).toHaveBeenCalled();
        expect(touchServiceSpy).toHaveBeenCalledWith(event);
        expect(onMouseDownSpy).toHaveBeenCalledWith(expectedParam);
    });

    it("#onTouchEnd should call #onMouseLeave and onMouseUp using TouchService's getMouseEventFromTouchEvent", () => {
        const onMouseLeaveSpy = spyOn(component, 'onMouseLeave');
        const onMouseUpSpy = spyOn(component, 'onMouseUp');
        const expectedParam = {} as MouseEvent;
        const touchServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent').and.returnValue(expectedParam);
        const event = {} as TouchEvent;
        component.onTouchEnd(event);
        expect(onMouseLeaveSpy).toHaveBeenCalled();
        expect(touchServiceSpy).toHaveBeenCalledWith(event);
        expect(onMouseUpSpy).toHaveBeenCalledWith(expectedParam);
    });

    it('#onMouseEnter should set isMouseInside to true', () => {
        component['isMouseInside'] = false;
        component.onMouseEnter();
        expect(component['isMouseInside']).toEqual(true);
    });

    it('#onMouseLeave should set isMouseInside to false', () => {
        component['isMouseInside'] = true;
        component.onMouseLeave();
        expect(component['isMouseInside']).toEqual(false);
    });
});
