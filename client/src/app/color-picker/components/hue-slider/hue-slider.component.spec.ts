import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HueSliderComponent } from '@app/color-picker/components/hue-slider/hue-slider.component';
import { ColorPickerService } from '@app/color-picker/services/color-picker.service';
import { Color } from '@app/shared/classes/color';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { TouchService } from '@app/shared/services/touch.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

const canvasWidth = 200;

describe('HueSliderComponent', () => {
    let component: HueSliderComponent;
    let fixture: ComponentFixture<HueSliderComponent>;
    let colorPickerServiceSpyObj: jasmine.SpyObj<ColorPickerService>;
    let drawSpy: jasmine.Spy<any>;
    let updateHueSpy: jasmine.Spy<any>;

    let hueChangedSubject: Subject<number>;

    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        colorPickerServiceSpyObj = jasmine.createSpyObj('ColorPickerService', [], {
            hue: 10,
            hueChanged$: hueChangedSubject,
        });
        TestBed.configureTestingModule({
            declarations: [HueSliderComponent],
            providers: [{ provide: ColorPickerService, useValue: colorPickerServiceSpyObj }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HueSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        drawSpy = spyOn<any>(component, 'draw').and.callThrough();
        updateHueSpy = spyOn<any>(component, 'updateHue').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngAfterViewInit should subscribe to hue changes', () => {
        const hueChangedSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        component.ngAfterViewInit();
        expect(hueChangedSpy).toHaveBeenCalled();
    });

    it("should update the slider's postion and call draw method on hue change", () => {
        component.ngAfterViewInit();
        const emitedValue = 1;
        hueChangedSubject.next(emitedValue);

        const expectedSliderPosition = (emitedValue / Color.maxHue) * canvasWidth;
        expect(component['sliderPosition']).toEqual(expectedSliderPosition);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from hue changes', () => {
        const hueChangesSubscriptionSpy = spyOn(component['hueChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(hueChangesSubscriptionSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should call updateValue method if isLeftMouseButtonDown is true', () => {
        const mouseEventStub = { clientX: 10 } as MouseEvent;
        component['isLeftMouseButtonDown'] = true;
        component.onMouseMove(mouseEventStub);
        expect(updateHueSpy).toHaveBeenCalledWith(mouseEventStub);
    });

    it('#onMouseMove not should call updateValue method if isLeftMouseButtonDown is false', () => {
        const mouseEventStub = { clientX: 10 } as MouseEvent;
        component['isLeftMouseButtonDown'] = false;
        component.onMouseMove(mouseEventStub);
        expect(updateHueSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should call updateHue method and change isLeftMouseButtonDown to true if mouse is inside', () => {
        const mouseEventStub = { button: MouseButton.Left, clientX: 10 } as MouseEvent;
        component['isMouseInside'] = true;
        component['isLeftMouseButtonDown'] = false;
        component.onMouseDown(mouseEventStub);

        expect(component['isLeftMouseButtonDown']).toEqual(true);
        expect(updateHueSpy).toHaveBeenCalledWith(mouseEventStub);
    });

    it('#onMouseDown not should call updateHue method and change isLeftMouseButtonDown to true if mouse is not inside', () => {
        const mouseEventStub = { clientX: 10 } as MouseEvent;
        component['isMouseInside'] = false;
        component['isLeftMouseButtonDown'] = false;
        component.onMouseDown(mouseEventStub);

        expect(component['isLeftMouseButtonDown']).toEqual(false);
        expect(updateHueSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should set isLeftMouseButtonDown to false if mouse button is left', () => {
        component['isLeftMouseButtonDown'] = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(false);
    });

    it('#onMouseUp should not set isLeftMouseButtonDown to down if the button pressed is not the left mouse button', () => {
        component['isLeftMouseButtonDown'] = true;
        component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component['isLeftMouseButtonDown']).toEqual(true);
    });

    it('#onTouchMove should call #onMouseMove using TouchService\'s getMouseEventFromTouchEvent', () => {
        const onMouseMoveSpy = spyOn(component, 'onMouseMove');
        const expectedParam = {} as MouseEvent;
        const touchServiceSpy = spyOn(TouchService, 'getMouseEventFromTouchEvent').and.returnValue(expectedParam);
        const event = {} as TouchEvent;
        component.onTouchMove(event);
        expect(touchServiceSpy).toHaveBeenCalledWith(event);
        expect(onMouseMoveSpy).toHaveBeenCalledWith(expectedParam);
    });

    it('#onTouchStart should call #onMouseEnter and #onMouseDown using TouchService\'s getMouseEventFromTouchEvent', () => {
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

    it('#onTouchEnd should call #onMouseLeave and onMouseUp using TouchService\'s getMouseEventFromTouchEvent', () => {
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

    it('#onMouseEnter should set isLeftMouseButtonDown to true', () => {
        component['isMouseInside'] = false;
        component.onMouseEnter();
        expect(component['isMouseInside']).toEqual(true);
    });

    it('#onMouseEnter should set isLeftMouseButtonDown to false', () => {
        component['isMouseInside'] = true;
        component.onMouseLeave();
        expect(component['isMouseInside']).toEqual(false);
    });
});
