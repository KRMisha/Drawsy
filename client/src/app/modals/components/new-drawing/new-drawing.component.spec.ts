import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { Color } from '@app/shared/classes/color';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let widthSpyObj: jasmine.SpyObj<FormControl>;
    let heightSpyObj: jasmine.SpyObj<FormControl>;
    let validFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let invalidFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let valueChangesSubject: Subject<any>;

    const sidebarWidth = 337;

    beforeEach(async(() => {
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['resetDrawing']);
        valueChangesSubject = new Subject<any>();
        widthSpyObj = jasmine.createSpyObj('FormControl', ['setValue'], { value: 18 });
        heightSpyObj = jasmine.createSpyObj('FormControl', ['setValue'], { value: 18 });
        validFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            valid: true,
            valueChanges: valueChangesSubject,
            controls: {
                width: widthSpyObj,
                height: heightSpyObj,
            },
        });
        invalidFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            valid: false,
            valueChanges: valueChangesSubject,
            controls: {
                width: widthSpyObj,
                height: heightSpyObj,
            },
        });

        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should subscribe to the drawingFormGroup's valueChanges", () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        component.wereDimensionsModified = false;
        component.ngOnInit();
        valueChangesSubject.next();
        expect(component.wereDimensionsModified).toEqual(true);
    });

    it('#ngOnDestroy should unsubscribe from its subscription', () => {
        const dimensionChangedSubscription = spyOn(component['drawingDimensionsChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(dimensionChangedSubscription).toHaveBeenCalled();
    });

    it('#onResize should not change the dimensions if the dimensions have been modified by the user', () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        component.wereDimensionsModified = true;
        component.onResize({} as Event);
        expect(widthSpyObj.setValue).not.toHaveBeenCalled();
        expect(heightSpyObj.setValue).not.toHaveBeenCalled();
    });

    it('#onResize should change the dimensions if they were not previously changed by the user', () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        component.wereDimensionsModified = false;
        const event = ({ target: { innerWidth: 12, innerHeight: 12 } as Window } as unknown) as Event;
        component.onResize(event);
        expect(widthSpyObj.setValue).toHaveBeenCalledWith((event.target as Window).innerWidth - sidebarWidth, { emitEvent: false });
        expect(heightSpyObj.setValue).toHaveBeenCalledWith((event.target as Window).innerHeight, { emitEvent: false });
    });

    it('#onSubmit should forward navigate call to the router if the drawing form is valid and drawingService.resetDrawing returns succesfully', () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        drawingServiceSpyObj.resetDrawing.and.returnValue(true);
        const color = {} as Color;
        component.backgroundColor = color;
        component.onSubmit();
        expect(drawingServiceSpyObj.resetDrawing).toHaveBeenCalledWith({ x: 18, y: 18 }, color);
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    });

    it('#onSubmit should not forward call to the router if the drawing form is invalid', () => {
        component.drawingFormGroup = invalidFormGroupSpyObj;
        component.onSubmit();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it("#onSubmit should not forward call to the router if drawingService's resetDrawing returns false", () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        drawingServiceSpyObj.resetDrawing.and.returnValue(false);
        component.onSubmit();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to the ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage(widthSpyObj);
        expect(errorMessageSpy).toHaveBeenCalledWith(widthSpyObj, 'Entiers');
    });

    it('drawingFormGroup should contain the window size at the start', () => {
        expect(component.drawingFormGroup.controls.width.value).toEqual(window.innerWidth - sidebarWidth);
        expect(component.drawingFormGroup.controls.height.value).toEqual(window.innerHeight);
    });

    it('drawingFormGroup should be invalid if the width is empty', () => {
        component.drawingFormGroup.controls.width.setValue('');
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the height is empty', () => {
        component.drawingFormGroup.controls.height.setValue('');
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the width is not an integer', () => {
        component.drawingFormGroup.controls.height.setValue('213abc');
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the height is not an integer', () => {
        component.drawingFormGroup.controls.height.setValue('ajf214');
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the width is negative', () => {
        component.drawingFormGroup.controls.height.setValue(-78);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the height is negative', () => {
        component.drawingFormGroup.controls.height.setValue(-12);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the width is 0', () => {
        component.drawingFormGroup.controls.height.setValue(0);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the height is 0', () => {
        component.drawingFormGroup.controls.height.setValue(0);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the width is larger than 10000', () => {
        component.drawingFormGroup.controls.height.setValue(10001);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });

    it('drawingFormGroup should be invalid if the height is larger than 10000', () => {
        component.drawingFormGroup.controls.height.setValue(11000);
        expect(component.drawingFormGroup.valid).toEqual(false);
    });
});
