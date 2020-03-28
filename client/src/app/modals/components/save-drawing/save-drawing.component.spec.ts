import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

fdescribe('SaveDrawingComponent', () => {
    let saveDrawingServiceSpyObj: jasmine.SpyObj<SaveDrawingService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let titleControlSpyObj: jasmine.SpyObj<FormControl>;
    let labelsControlSpyObj: jasmine.SpyObj<FormControl>;
    let saveDrawingFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;

    const initialLabels = ['abc', 'def', 'hij'];
    const initialTitle = 'bonjour';
    const initialId = '1';
    beforeEach(async(() => {
        saveDrawingServiceSpyObj = jasmine.createSpyObj('SaveDrawingService', ['saveDrawing']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            labels: initialLabels,
            title: initialTitle,
            id: initialId,
        });

        titleControlSpyObj = jasmine.createSpyObj('FormControl', [], {
            value: initialTitle,
        });
        labelsControlSpyObj = jasmine.createSpyObj('FormControl', ['indexOf', 'splice'], {
            value: initialLabels,
            invalid: false,
        });
        saveDrawingFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                title: titleControlSpyObj,
                labels: labelsControlSpyObj,
            },
        });

        TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngOnInit should copy the labels from drawingService', () => {
        component.ngOnInit();
        expect(component.labels).toEqual(initialLabels);
    });

    it('#addLabel should early return if the labels of the form are invalid', () => {
        const invalidLabelsControlSpyObj = jasmine.createSpyObj('FormControl', ['push'], {
            invalid: true,
        });
        const invalidFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
            controls: {
                labels: invalidLabelsControlSpyObj,
            },
        });
        component.saveDrawingFormGroup = invalidFormGroupSpyObj;
        const pushSpy = spyOn(component.labels, 'push');
        const event = { value: '1' } as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('#addLabel should early return if the submitted label is undefined', () => {
        const event = ({ value: undefined } as unknown) as MatChipInputEvent;
        const pushSpy = spyOn(component.labels, 'push');
        component.addLabel(event);
        expect(pushSpy);
    });

    it('#addLabel should early return if the submitted label is of length 0', () => {
        const event = ({ value: '' } as unknown) as MatChipInputEvent;
        const pushSpy = spyOn(component.labels, 'push');
        component.addLabel(event);
        expect(pushSpy);
    });

    it('#addLabel should push label into labels if the label form is valid and the value is not undefined and of positive length', () => {
        const event = ({ value: 'th1sist-otrigg3rmi-sha' } as unknown) as MatChipInputEvent;
        const pushSpy = spyOn(component.labels, 'push');
        component.addLabel(event);
        expect(pushSpy);
    });

    it("#removeLabel should not remove label if it's not in the labels", () => {
        const label = 'aloha';
        const spliceSpy = spyOn(component.labels, 'splice');
        component.removeLabel(label);
        expect(spliceSpy).not.toHaveBeenCalled();
    });

    it("#removeLabel should remove label if it's in the labels", () => {
        const label = 'def';
        const spliceSpy = spyOn(component.labels, 'splice');
        component.removeLabel(label);
        expect(spliceSpy).toHaveBeenCalledWith(1, 1);
    });

    it('#onSubmit should forward the call to the saveDrawingService after updating the title and labels', () => {
        const drawingServiceMock = ({ title: undefined, labels: undefined } as unknown) as DrawingService;
        component.onSubmit();
        expect(drawingServiceMock.title).toEqual(initialTitle);
        expect(drawingServiceMock.labels).toEqual(initialLabels);
        expect(saveDrawingServiceSpyObj.saveDrawing).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage(titleControlSpyObj);
        expect(errorMessageSpy).toHaveBeenCalledWith(titleControlSpyObj, 'A-Z, a-z, 0-9');
    });

    it('#get title should return appropriate title', () => {
        const returnValue = component.title;
        expect(returnValue).toEqual(drawingServiceSpyObj.title);
    });

    it('#get isCreateDrawingAction should return true when there is a defined id', () => {
        const drawingServiceMock = { id: '123' } as DrawingService;
        component['drawingService'] = drawingServiceMock; // tslint:disable-line: no-string-literal
        const returnValue = component.isCreateDrawingAction;
        expect(returnValue).toEqual(true);
    });

    it('#get isCreateDrawingAction should return false when the id is undefined', () => {
        const drawingServiceMock = { id: undefined } as DrawingService;
        component['drawingService'] = drawingServiceMock; // tslint:disable-line: no-string-literal
        const returnValue = component.isCreateDrawingAction;
        expect(returnValue).toEqual(false);
    });
});
