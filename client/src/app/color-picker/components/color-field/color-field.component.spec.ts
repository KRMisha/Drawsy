import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorFieldComponent } from '@app/color-picker/components/color-field/color-field.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: max-line-length

describe('ColorFieldComponent', () => {
    let component: ColorFieldComponent;
    let fixture: ComponentFixture<ColorFieldComponent>;
    let hueChangedSubject: Subject<number>;
    let saturationChangedSubject: Subject<number>;
    let valueChangedSubject: Subject<number>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;
    let saturationCanvasSpyObj: jasmine.SpyObj<ElementRef<HTMLCanvasElement>>;
    let nativeElementSpyObj: jasmine.SpyObj<HTMLCanvasElement>;

    const context = {} as CanvasRenderingContext2D;

    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        saturationChangedSubject = new Subject<number>();
        valueChangedSubject = new Subject<number>();
        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbString']);
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', ['getColor'], {
            hueChanged$: hueChangedSubject,
            saturationChanged$: saturationChangedSubject,
            valueChanged$: valueChangedSubject,
        });
        colorPickerServiceSpyObj.getColor.and.returnValue(colorSpyObj);
        nativeElementSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['getContext', 'getBoundingClientRect'], {
            width: 0,
            height: 0,
        });
        nativeElementSpyObj.getContext.and.returnValue(context);
        nativeElementSpyObj.getBoundingClientRect.and.returnValue({ x: 0, y: 0 } as DOMRect);
        saturationCanvasSpyObj = jasmine.createSpyObj('ElementRed<HTMLCanvasElement>', [], {
            nativeElement: nativeElementSpyObj,
        });
        TestBed.configureTestingModule({
            declarations: [ColorFieldComponent],
            providers: [{ provide: ColorPickerService, useValue: colorPickerServiceSpyObj }],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ColorFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['colorPickerService'] = colorPickerServiceSpyObj;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngAfterViewInit should subscribe to colorPickerService's hueChanged, saturationChanged and valueChanged", async(() => {
        const hueSubscriptionSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        const saturationSubscriptionSpy = spyOn(saturationChangedSubject, 'subscribe').and.callThrough();
        const valueSubscriptionSpy = spyOn(valueChangedSubject, 'subscribe').and.callThrough();
        component.ngAfterViewInit();
        expect(hueSubscriptionSpy).toHaveBeenCalled();
        expect(saturationSubscriptionSpy).toHaveBeenCalled();
        expect(valueSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#ngAfterViewInit should create the context from the canvas', () => {
        component['saturationValueCanvas'] = saturationCanvasSpyObj;
        component.ngAfterViewInit();
        expect(component['context']).toBe(context);
    });

    it('hueChanged subscription should call #draw', () => {
        const drawSpy = spyOn<any>(component, 'draw').and.callThrough();
        const hueValue = 0.1;
        hueChangedSubject.next(hueValue);
        expect(drawSpy).toHaveBeenCalled();
    });

    it("saturationChanged subscription should set the slider's x position and call #draw", () => {
        const drawSpy = spyOn<any>(component, 'draw').and.callThrough();
        const sliderPositionMock = { x: 0, y: 0 } as Vec2;
        component['sliderPosition'] = sliderPositionMock;
        const saturationValue = 0.3;
        saturationChangedSubject.next(saturationValue);
        expect(sliderPositionMock.x).not.toEqual(0);
        expect(drawSpy).toHaveBeenCalled();
    });

    it("valueChanged subscription should set the slider's y position and call #draw", () => {
        const drawSpy = spyOn<any>(component, 'draw').and.callThrough();
        const sliderPositionMock = { x: 0, y: 0 } as Vec2;
        component['sliderPosition'] = sliderPositionMock;
        const valueValue = 0.3;
        valueChangedSubject.next(valueValue);
        expect(sliderPositionMock.y).not.toEqual(0);
        expect(drawSpy).toHaveBeenCalled();
    });

    it("#ngOnDestroy should unsubscribe from the colorPickerService's subscriptions", async(() => {
        const hueChangedSubscriptionSpy = spyOn(component['hueChangedSubscription'], 'unsubscribe');
        const saturationChangedSubscriptionSpy = spyOn(component['saturationChangedSubscription'], 'unsubscribe');
        const valueChangedSubscriptionSpy = spyOn(component['valueChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(hueChangedSubscriptionSpy).toHaveBeenCalled();
        expect(saturationChangedSubscriptionSpy).toHaveBeenCalled();
        expect(valueChangedSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#onMouseMove should call #updateColor if the left mouse button is down', () => {
        component['isLeftMouseButtonDown'] = true;
        const updateColorSpy = spyOn<any>(component, 'updateColor').and.callThrough();
        const event = { clientX: 0, clientY: 0 } as MouseEvent;
        component.onMouseMove(event);
        expect(updateColorSpy).toHaveBeenCalledWith(event);
    });

    it('#onMouseMove should not call #updateColor if the left mouse button is not down', () => {
        component['isLeftMouseButtonDown'] = false;
        const updateColorSpy = spyOn<any>(component, 'updateColor');
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        expect(updateColorSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should set isLeftMouseButtonDown to true and call #updateColor if the mouse is inside the component', () => {
        component['isMouseInside'] = true;
        component['isLeftMouseButtonDown'] = false;
        const updateColorSpy = spyOn<any>(component, 'updateColor').and.callThrough();
        const event = { button: MouseButton.Left, clientX: 10, clientY: 10 } as MouseEvent;
        component.onMouseDown(event);
        expect(component['isLeftMouseButtonDown']).toEqual(true);
        expect(updateColorSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should not set isLeftMouseButtonDown to true and should not call #updateColor if the mouse is not inside the component', () => {
        component['isMouseInside'] = false;
        component['isLeftMouseButtonDown'] = false;
        const updateColorSpy = spyOn<any>(component, 'updateColor').and.callThrough();
        component.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(false);
        expect(updateColorSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should set isLeftMouseButtonDown to false', () => {
        component['isLeftMouseButtonDown'] = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(false);
    });

    it('#onMouseUp should not set isLeftButtonDown to false if the button pressed is not the left mouse button', () => {
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
