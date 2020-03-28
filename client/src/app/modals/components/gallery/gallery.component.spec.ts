import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { GalleryComponent } from '@app/modals/components/gallery/gallery.component';
import { GalleryService } from '@app/modals/services/gallery.service';
import { SvgFileContainer } from '@app/shared/classes/svg-file-container';
import { ErrorMessageService } from '@app/shared/services/error-message.service';
import { Subject } from 'rxjs';

describe('GalleryComponent', () => {
    let loadingCompleteSubject: Subject<void>;
    let galleryServiceSpyObj: jasmine.SpyObj<GalleryService>;
    let labelsFormControlSpyObj: jasmine.SpyObj<FormControl>;
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;

    const initialLoadingComplete = false;

    beforeEach(async(() => {
        loadingCompleteSubject = new Subject<void>();
        galleryServiceSpyObj = jasmine.createSpyObj(
            'GalleryService',
            ['getDrawingsWithLabels', 'getAllDrawings', 'loadDrawing', 'deleteDrawing', 'hasDrawings'],
            {
                isLoadingComplete: initialLoadingComplete,
                loadingCompleted$: loadingCompleteSubject,
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

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#ngOnInit should subscribe to galleryService's loadingComplete and call galleryService's getAllDrawings", async(() => {
        component.ngOnInit();
        expect(galleryServiceSpyObj.getAllDrawings).toHaveBeenCalled();

        loadingCompleteSubject.next();
        expect(galleryServiceSpyObj.getDrawingsWithLabels).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from the loadingComplete subscription', async(() => {
        const unsubscribeSpy = spyOn(component['loadingCompletedSubscription'], 'unsubscribe'); // tslint:disable-line: no-string-literal
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    }));

    it('#addLabel should early return if the label form is invalid', () => {
        const invalidFormSpyObj = jasmine.createSpyObj('FormControl', [], {
            invalid: true,
        });
        component.labelsFormControl = invalidFormSpyObj;
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

    it('#addLabel should push the label into searchLabels and call getDrawingsWithLabels', () => {
        component.labelsFormControl = labelsFormControlSpyObj;
        const labels = ['456', '789'];
        component.searchLabels = labels;
        const pushSpy = spyOn(component.searchLabels, 'push').and.callThrough();
        const event = { value: '123', input: { value: '' } as HTMLInputElement } as MatChipInputEvent;
        component.addLabel(event);
        expect(pushSpy).toHaveBeenCalledWith(event.value);
        expect(galleryServiceSpyObj.getDrawingsWithLabels).toHaveBeenCalled();
    });

    it('#removeLabel should not splice the labels array if the label is not in it', () => {
        const labels = ['123'];
        component.searchLabels = labels;
        const spliceSpy = spyOn(component.searchLabels, 'splice');
        component.removeLabel('abc');
        expect(spliceSpy).not.toHaveBeenCalled();
    });

    it('#removeLabel should remove the label from the labels array', () => {
        const labels = ['123', '456', '789'];
        component.searchLabels = labels;
        component.removeLabel('456');
        expect(component.searchLabels).toEqual(['123', '789']);
        expect(galleryServiceSpyObj.getDrawingsWithLabels).toHaveBeenCalled();
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

    it('#hasDrawings should forward the call to galleryService', () => {
        component.hasDrawings();
        expect(galleryServiceSpyObj.hasDrawings).toHaveBeenCalled();
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage();
        expect(errorMessageSpy).toHaveBeenCalledWith(component.labelsFormControl, 'A-Z, a-z, 0-9');
    });

    it('#get isLoadingComplete should return appropriate isLoadingComplete', () => {
        const returnValue = component.isLoadingComplete;
        expect(returnValue).toEqual(galleryServiceSpyObj.isLoadingComplete);
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
