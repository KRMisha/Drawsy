import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { DrawingPreviewComponent } from '@app/drawing/components/drawing-preview/drawing-preview.component';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

// tslint:disable: no-string-literal

describe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let exportDrawingServiceSpyObj: jasmine.SpyObj<ExportDrawingService>;
    let changeDetectorRefSpyObj: jasmine.SpyObj<ChangeDetectorRef>;
    let drawingPreviewComponentSpyObj: jasmine.SpyObj<DrawingPreviewComponent>;
    const initialTitle = 'initialTitle';

    const drawingPreviewRootStub = {} as SVGSVGElement;
    beforeEach(async(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            title: initialTitle,
        });
        exportDrawingServiceSpyObj = jasmine.createSpyObj('ExportDrawingService', ['emailDrawing', 'downloadDrawing']);
        changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        drawingPreviewComponentSpyObj = jasmine.createSpyObj('DrawingPreviewComponent', [], {
            drawingRoot: {
                nativeElement: drawingPreviewRootStub,
            },
        });
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ExportDrawingService, useValue: exportDrawingServiceSpyObj },
                { provide: ChangeDetectorRef, useValue: changeDetectorRefSpyObj },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['drawingPreview'] = drawingPreviewComponentSpyObj;
        component['changeDetectorRef'] = changeDetectorRefSpyObj;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onInit should subscribe to changes to email option and toggle the emailAddress form', () => {
        const enableSpy = spyOn(component.exportDrawingFormGroup.controls.emailAddress, 'enable');
        const disableSpy = spyOn(component.exportDrawingFormGroup.controls.emailAddress, 'disable');
        component.exportDrawingFormGroup.controls.emailEnabled.setValue(true);
        expect(enableSpy).toHaveBeenCalled();
        component.exportDrawingFormGroup.controls.emailEnabled.setValue(false);
        expect(disableSpy).toHaveBeenCalled();
    });

    it('#ngOnDestroy should unsubscribe from email option changes', () => {
        // tslint:disable-next-line: no-any
        const emailEnabledChangedSubscriptionSpy = spyOn<any>(component['emailEnabledChangedSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(emailEnabledChangedSubscriptionSpy).toHaveBeenCalled();
    });

    it("#onSubmit should set drawingService's title and force change detection on the component's template", () => {
        const drawingServiceMock = { title: initialTitle } as DrawingService;
        component['drawingService'] = drawingServiceMock;
        component.fileType = FileType.Jpeg;
        const newTitle = 'bonjours';
        component.exportDrawingFormGroup.controls.title.setValue(newTitle);
        component.onSubmit();
        expect(drawingServiceMock.title).toEqual(newTitle);
        expect(changeDetectorRefSpyObj.detectChanges).toHaveBeenCalled();
    });

    it('#onSubmit should forward email sending to the exportDrawingService if the email option is selected', () => {
        const emailAddress = 'mmmmmkkkkkkkkkkk@caca.pipi';
        component.exportDrawingFormGroup.controls.emailAddress.setValue(emailAddress);
        component.exportDrawingFormGroup.controls.emailEnabled.setValue(true);
        component.onSubmit();
        expect(exportDrawingServiceSpyObj.emailDrawing).toHaveBeenCalledWith(drawingPreviewRootStub, emailAddress, component.fileType);
    });

    it("#onSubmit should forward the drawing's download to the exportDrawingService if the email option is not selected", () => {
        component.exportDrawingFormGroup.controls.emailEnabled.setValue(false);
        component.onSubmit();
        expect(exportDrawingServiceSpyObj.downloadDrawing).toHaveBeenCalledWith(drawingPreviewRootStub, component.fileType);
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        const formControlStub = {} as AbstractControl;
        const humanFriendlyPattern = 'Penis';
        component.getErrorMessage(formControlStub, humanFriendlyPattern);
        expect(errorMessageSpy).toHaveBeenCalledWith(formControlStub, humanFriendlyPattern);
    });

    it('titleForm should not be valid when empty', () => {
        component.exportDrawingFormGroup.controls.title.setValue('');
        expect(component.exportDrawingFormGroup.controls.title.valid).toEqual(false);
    });

    it('titleForm should not be valid when input is not an appropriate string', () => {
        component.exportDrawingFormGroup.controls.title.setValue('!@#$%^bonjour');
        expect(component.exportDrawingFormGroup.controls.title.valid).toEqual(false);
    });

    it('titleForm should not be valid when the string length exceeds the limit (25)', () => {
        component.exportDrawingFormGroup.controls.title.setValue('123456789012345678901234567');
        expect(component.exportDrawingFormGroup.controls.title.valid).toEqual(false);
    });

    it('titleForm should be valid when the title follows the restrictions', () => {
        component.exportDrawingFormGroup.controls.title.setValue('bonjour');
        expect(component.exportDrawingFormGroup.controls.title.valid).toEqual(true);
    });
});
