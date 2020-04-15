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

    beforeEach(async(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            title: initialTitle,
        });
        exportDrawingServiceSpyObj = jasmine.createSpyObj('ExportDrawingService', ['exportDrawing']);
        changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        drawingPreviewComponentSpyObj = jasmine.createSpyObj('DrawingPreviewComponent', [], {
            drawingRoot: {
                nativeElement: {},
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

    it("#onSubmit should update the title with the form's title, call finalizePreview and export the drawing", () => {
        const drawingServiceMock = { title: initialTitle } as DrawingService;
        component['drawingService'] = drawingServiceMock;
        component.fileType = FileType.Jpeg;
        const newTitle = 'bonjours';
        component.exportDrawingFormGroup.controls.title.setValue(newTitle);
        component.onSubmit();
        expect(drawingServiceMock.title).toEqual(newTitle);
        expect(changeDetectorRefSpyObj.detectChanges).toHaveBeenCalled();
        expect(exportDrawingServiceSpyObj.downloadDrawing).toHaveBeenCalledWith(
            drawingPreviewComponentSpyObj.drawingRoot.nativeElement,
            FileType.Jpeg
        );
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
