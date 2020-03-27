import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { NewDrawingComponent } from '@app/modals/components/new-drawing/new-drawing.component';
import { Color } from '@app/shared/classes/color';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subject } from 'rxjs';

// tslint:disable: max-classes-per-file
// tslint:disable: no-magic-numbers
// tslint:disable: no-empty
// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let routerSpyObj: jasmine.SpyObj<Router>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let valueChangesSubject: Subject<any>;
    let widthSpyObj: jasmine.SpyObj<FormControl>;
    let heightSpyObj: jasmine.SpyObj<FormControl>;
    let validFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let invalidFormGroupSpyObj: jasmine.SpyObj<FormGroup>;

    const sidebarWidth = 337;

    beforeEach(async(() => {
        routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['confirmNewDrawing']);
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
            imports: [FormsModule, MatCardModule, MatIconModule, ReactiveFormsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: Router, useValue: routerSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        component.ngOnInit();
        const dimensionChangedSubscription = spyOn(component['drawingDimensionChangedSubscription'], 'unsubscribe');
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
        expect(widthSpyObj.setValue).toHaveBeenCalledWith(12 - sidebarWidth, { emitEvent: false });
        expect(heightSpyObj.setValue).toHaveBeenCalledWith(12, { emitEvent: false });
    });

    it('#onSubmit should forward navigate call to the router if the drawing form is valid and drawingService.confirmNewDrawing returns succesfully', () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        drawingServiceSpyObj.confirmNewDrawing.and.returnValue(true);
        component.onSubmit();
        expect(drawingServiceSpyObj.confirmNewDrawing).toHaveBeenCalledWith(
            { x: 18, y: 18 },
            Color.fromRgb(Color.maxRgb, Color.maxRgb, Color.maxRgb)
        );
        expect(routerSpyObj.navigate).toHaveBeenCalledWith(['/editor']);
    });

    it('#onSubmit should not forward call to the router if the drawing form is invalid', () => {
        component.drawingFormGroup = invalidFormGroupSpyObj;
        component.onSubmit();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it("#onSubmit should not forward call to the router if drawingService's confirmNewDrawing returns false", () => {
        component.drawingFormGroup = validFormGroupSpyObj;
        drawingServiceSpyObj.confirmNewDrawing.and.returnValue(false);
        component.onSubmit();
        expect(routerSpyObj.navigate).not.toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to the ErrorMessageService', () => {
        spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage(widthSpyObj);
        expect(ErrorMessageService.getErrorMessage).toHaveBeenCalledWith(widthSpyObj, 'Entiers');
    });

    // it('drawingFormGroup should contain the window size at the start', () => {
    //     const newWindow = { innerHeight: 1200, innerWidth: 1200} as Window;
    //     component.drawingFormGroup.reset();
    //     expect(component.drawingFormGroup.controls.width.value).toEqual(1200 - sidebarWidth);
    //     expect(component.drawingFormGroup.controls.height.value).toEqual(1200);
    // });

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
