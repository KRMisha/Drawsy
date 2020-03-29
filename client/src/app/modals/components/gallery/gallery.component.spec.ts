import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let galleryServiceSpyObj: jasmine.SpyObj<GalleryService>;
    let labelsFormControlSpyObj: jasmine.SpyObj<FormControl>;

    const initialLoadingComplete = false;
    const drawingStub = {} as SvgFileContainer;
    const initialDrawings = [drawingStub, drawingStub];

    beforeEach(async(() => {
        galleryServiceSpyObj = jasmine.createSpyObj(
            'GalleryService',
            ['getDrawingsWithLabels', 'getAllDrawings', 'loadDrawing', 'deleteDrawing', 'hasDrawings'],
            {
                drawings: initialDrawings,
                isLoadingComplete: initialLoadingComplete,
            }
        );
        labelsFormControlSpyObj = jasmine.createSpyObj('FormControl', [], {
            invalid: false,
        });

        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            providers: [{ provide: GalleryService, useValue: galleryServiceSpyObj }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit call galleryService's getAllDrawings", async(() => {
        component.ngOnInit();
        expect(galleryServiceSpyObj.getAllDrawings).toHaveBeenCalled();
    }));

    it('#addLabel should early return if the label form is invalid', () => {
        component.labelsFormControl = jasmine.createSpyObj('FormControl', [], {
            invalid: true,
        });
        const pushSpy = spyOn(component.searchLabels, 'push');
        const event = { value: '123' } as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('#addLabel should early return if the event value is undefined', () => {
        component.labelsFormControl = labelsFormControlSpyObj;
        const pushSpy = spyOn(component.searchLabels, 'push');
        const event = ({ value: undefined } as unknown) as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('#addLabel should early return if the event value is of length 0', () => {
        component.labelsFormControl = labelsFormControlSpyObj;
        const pushSpy = spyOn(component.searchLabels, 'push');
        const event = ({ value: '' } as unknown) as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('#addLabel should add the label to the searchLabel if it is a valid label', () => {
        component.labelsFormControl = labelsFormControlSpyObj;
        const pushSpy = spyOn(component.searchLabels, 'push');
        const event = ({ value: 'Valid', input: { value: 'Valid' } } as unknown) as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).toHaveBeenCalled();
    });

    it('#removeLabel should not splice the labels array if the label is not in it', () => {
        const labels = ['123'];
        component.searchLabels = labels;
        const spliceSpy = spyOn(component.searchLabels, 'splice');
        component.removeLabel('abc');
        expect(spliceSpy).not.toHaveBeenCalled();
    });

    it('#removeLabel should splice the labels array if the label is in it', () => {
        const labels = ['123'];
        component.searchLabels = labels;
        const spliceSpy = spyOn(component.searchLabels, 'splice');
        component.removeLabel('123');
        expect(spliceSpy).toHaveBeenCalled();
    });

    it('#loadDrawing should forward call to galleryService', () => {
        const drawing = {} as SvgFileContainer;
        component.loadDrawing(drawing);
        expect(galleryServiceSpyObj.loadDrawing).toHaveBeenCalledWith(drawing);
    });

    it('#deleteDrawing should forward call to galleryService', () => {
        const drawing = {} as SvgFileContainer;
        component.deleteDrawing(drawing);
        expect(galleryServiceSpyObj.deleteDrawing).toHaveBeenCalledWith(drawing);
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage();
        expect(errorMessageSpy).toHaveBeenCalledWith(component.labelsFormControl, 'A-Z, a-z, 0-9');
    });

    it("#get drawings should return galleryService's drawings", () => {
        const returnValue = component.drawings;
        expect(returnValue).toEqual(initialDrawings);
    });

    it('labelForm should be invalid if the label does not match the pattern', () => {
        component.labelsFormControl.setValue('#%$allo123');
        expect(component.labelsFormControl.valid).toEqual(false);
    });

    it('labelForm should be invalid if the label is too long (15 char)', () => {
        component.labelsFormControl.setValue('12345678901234567');
        expect(component.labelsFormControl.valid).toEqual(false);
    });

    it('labelForm should be valid if the label is appropriate', () => {
        component.labelsFormControl.setValue('bonjour123');
        expect(component.labelsFormControl.valid).toEqual(true);
    });
});
