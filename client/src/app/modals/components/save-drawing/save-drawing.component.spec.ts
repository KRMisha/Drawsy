// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormControl, FormGroup } from '@angular/forms';
// import { MatChipInputEvent } from '@angular/material/chips';
// import { DrawingService } from '@app/drawing/services/drawing.service';
// import { SaveDrawingComponent } from '@app/modals/components/save-drawing/save-drawing.component';
// import { SaveDrawingService } from '@app/modals/services/save-drawing.service';
// import { ErrorMessageService } from '@app/shared/services/error-message.service';

// // tslint:disable: no-string-literal

// describe('SaveDrawingComponent', () => {
//     let saveDrawingServiceSpyObj: jasmine.SpyObj<SaveDrawingService>;
//     let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
//     let titleControlSpyObj: jasmine.SpyObj<FormControl>;
//     let labelsControlSpyObj: jasmine.SpyObj<FormControl>;
//     let saveDrawingFormGroupSpyObj: jasmine.SpyObj<FormGroup>;
//     let component: SaveDrawingComponent;
//     let fixture: ComponentFixture<SaveDrawingComponent>;

//     const initialLabels = ['abc', 'def', 'hij'];
//     const initialTitle = 'bonjour';
//     const initialId = '1';

//     beforeEach(async(() => {
//         saveDrawingServiceSpyObj = jasmine.createSpyObj('SaveDrawingService', ['saveDrawing']);
//         drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
//             labels: initialLabels,
//             title: initialTitle,
//             id: initialId,
//         });

//         titleControlSpyObj = jasmine.createSpyObj('FormControl', [], {
//             value: initialTitle,
//         });
//         labelsControlSpyObj = jasmine.createSpyObj('FormControl', [], {
//             value: initialLabels,
//             invalid: false,
//         });
//         saveDrawingFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
//             controls: {
//                 title: titleControlSpyObj,
//                 labels: labelsControlSpyObj,
//             },
//         });

//         TestBed.configureTestingModule({
//             declarations: [SaveDrawingComponent],
//             providers: [
//                 { provide: SaveDrawingService, useValue: saveDrawingServiceSpyObj },
//                 { provide: DrawingService, useValue: drawingServiceSpyObj },
//             ],
//             schemas: [NO_ERRORS_SCHEMA],
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SaveDrawingComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('#ngOnInit should copy the labels from drawingService', () => {
//         component.ngOnInit();
//         expect(component.labels).toEqual(initialLabels);
//     });

//     it('#addLabel should return early if the labels of the form are invalid', () => {
//         component.saveDrawingFormGroup = saveDrawingFormGroupSpyObj;
//         const invalidLabelsControlSpyObj = jasmine.createSpyObj('FormControl', ['push'], {
//             invalid: true,
//         });
//         const invalidFormGroupSpyObj = jasmine.createSpyObj('FormGroup', [], {
//             controls: {
//                 labels: invalidLabelsControlSpyObj,
//             },
//         });
//         component.saveDrawingFormGroup = invalidFormGroupSpyObj;
//         const pushSpy = spyOn(component.labels, 'push');
//         const event = { value: '1' } as MatChipInputEvent;
//         component.addLabel(event);
//         expect(pushSpy).not.toHaveBeenCalled();
//     });

//     it('#addLabel should return early if the submitted label is undefined', () => {
//         component.saveDrawingFormGroup = saveDrawingFormGroupSpyObj;
//         const event = ({ value: undefined } as unknown) as MatChipInputEvent;
//         const pushSpy = spyOn(component.labels, 'push');
//         component.addLabel(event);
//         expect(pushSpy).not.toHaveBeenCalled();
//     });

//     it('#addLabel should return early if the submitted label is of length 0', () => {
//         component.saveDrawingFormGroup = saveDrawingFormGroupSpyObj;
//         const event = ({ value: '' } as unknown) as MatChipInputEvent;
//         const pushSpy = spyOn(component.labels, 'push');
//         component.addLabel(event);
//         expect(pushSpy).not.toHaveBeenCalled();
//     });

//     it('#addLabel should push label into labels if the label form is valid and the value is not undefined and of positive length', () => {
//         component.saveDrawingFormGroup = saveDrawingFormGroupSpyObj;
//         const event = ({ value: 'th1sist-otrigg3rmi-sha', input: { value: '' } as HTMLInputElement } as unknown) as MatChipInputEvent;
//         const pushSpy = spyOn(component.labels, 'push');
//         component.addLabel(event);
//         expect(pushSpy).toHaveBeenCalled();
//     });

//     it("#removeLabel should not remove label if it's not in the labels", () => {
//         const label = 'aloha';
//         const spliceSpy = spyOn(component.labels, 'splice');
//         component.removeLabel(label);
//         expect(spliceSpy).not.toHaveBeenCalled();
//     });

//     it("#removeLabel should remove label if it's in the labels", () => {
//         const label = 'def';
//         const spliceSpy = spyOn(component.labels, 'splice');
//         component.removeLabel(label);
//         expect(spliceSpy).toHaveBeenCalledWith(1, 1);
//     });

//     it('#onSubmit should forward the call to the saveDrawingService after updating the title and labels', () => {
//         component.saveDrawingFormGroup = saveDrawingFormGroupSpyObj;
//         const drawingServiceMock = ({ title: undefined, labels: undefined } as unknown) as DrawingService;
//         component['drawingService'] = drawingServiceMock;
//         component.onSubmit();
//         expect(drawingServiceMock.title).toEqual(initialTitle);
//         expect(drawingServiceMock.labels).toEqual(initialLabels);
//         expect(saveDrawingServiceSpyObj.saveDrawing).toHaveBeenCalled();
//     });

//     it('#getErrorMessage should forward the call to ErrorMessageService', () => {
//         const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
//         component.getErrorMessage(titleControlSpyObj);
//         expect(errorMessageSpy).toHaveBeenCalledWith(titleControlSpyObj, 'A-Z, a-z, 0-9');
//     });

//     it("#get title should return the drawingService's title", () => {
//         const returnValue = component.title;
//         expect(returnValue).toEqual(drawingServiceSpyObj.title);
//     });

//     it('#get isCreateDrawingAction should return false when there is a defined id', () => {
//         const drawingServiceMock = { id: '123' } as DrawingService;
//         component['drawingService'] = drawingServiceMock;
//         const returnValue = component.isCreateDrawingAction;
//         expect(returnValue).toEqual(false);
//     });

//     it('#get isCreateDrawingAction should return true when the id is undefined', () => {
//         const drawingServiceMock = { id: undefined } as DrawingService;
//         component['drawingService'] = drawingServiceMock;
//         const returnValue = component.isCreateDrawingAction;
//         expect(returnValue).toEqual(true);
//     });

//     it('title form should be invalid when the title is empty', () => {
//         const control = component.saveDrawingFormGroup.controls.title;
//         control.setValue('');
//         expect(control.valid).toEqual(false);
//     });

//     it('labels form should be invalid when the label does not match the pattern', () => {
//         const control = component.saveDrawingFormGroup.controls.labels;
//         control.setValue('@#$allo123');
//         expect(control.valid).toEqual(false);
//     });

//     it('title form should be invalid when the title is too long (25 chars)', () => {
//         const control = component.saveDrawingFormGroup.controls.title;
//         control.setValue('123456789012345678901234567');
//         expect(control.valid).toEqual(false);
//     });

//     it('labels form should be invalid when the label is too long (15 chars)', () => {
//         const control = component.saveDrawingFormGroup.controls.labels;
//         control.setValue('12345678901234567');
//         expect(control.valid).toEqual(false);
//     });

//     it('title form should be valid when the title respects the validators', () => {
//         const control = component.saveDrawingFormGroup.controls.title;
//         control.setValue('bonjour');
//         expect(control.valid).toEqual(true);
//     });

//     it('labels form should be valid when the label respects the validators', () => {
//         const control = component.saveDrawingFormGroup.controls.labels;
//         control.setValue('bonjour');
//         expect(control.valid).toEqual(true);
//     });
// });
