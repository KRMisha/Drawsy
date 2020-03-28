// tslint:disable: no-string-literal
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DrawingFilter } from '@app/drawing/enums/drawing-filter.enum';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingComponent } from '@app/modals/components/export-drawing/export-drawing.component';
import { ErrorMessageService } from '@app/shared/services/error-message.service';

describe('ExportDrawingComponent', () => {
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let drawingPreviewServiceSpyObj: jasmine.SpyObj<DrawingPreviewService>;
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    const initialTitle = 'initialTitle';
    const initialDrawingFilter: DrawingFilter = DrawingFilter.None;

    beforeEach(async(() => {
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', ['exportDrawing']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], { title: initialTitle });
        drawingPreviewServiceSpyObj = jasmine.createSpyObj('DrawingPreviewService', ['finalizePreview'], {
            drawingFilter: initialDrawingFilter,
        });
        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            imports: [ReactiveFormsModule, FormsModule],
            providers: [
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: DrawingPreviewService, useValue: drawingPreviewServiceSpyObj },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("#onSubmit should update the title with the form's title, call finalizePreview and export the drawing", () => {
        const drawingServiceMock = { title: initialTitle } as DrawingService;
        component['drawingService'] = drawingServiceMock;
        component.currentFileType = FileType.Jpeg;
        component.titleFormControl.setValue('bonjour');
        component.onSubmit();
        expect(drawingServiceMock.title).toEqual('bonjour');
        expect(drawingPreviewServiceSpyObj.finalizePreview).toHaveBeenCalled();
        expect(drawingSerializerServiceSpyObj.exportDrawing).toHaveBeenCalledWith('bonjour', FileType.Jpeg);
    });

    it('#getErrorMessage should forward the call to ErrorMessageService', () => {
        const errorMessageSpy = spyOn(ErrorMessageService, 'getErrorMessage');
        component.getErrorMessage();
        expect(errorMessageSpy).toHaveBeenCalledWith(component.titleFormControl, 'A-Z, a-z, 0-9');
    });

    it('#get DrawingFilter should return appropriate Filter', () => {
        const returnValue = component.drawingFilter;
        expect(returnValue).toEqual(initialDrawingFilter);
    });

    it("#set DrawingFilter should change drawingPreviewService's drawingFilter", () => {
        const drawingPreviewServiceMock = { drawingFilter: initialDrawingFilter } as DrawingPreviewService;
        component['drawingPreviewService'] = drawingPreviewServiceMock; // tslint:disable-line: no-string-literal
        component.drawingFilter = DrawingFilter.BlackAndWhite;
        expect(drawingPreviewServiceMock.drawingFilter).toEqual(DrawingFilter.BlackAndWhite);
    });

    it('titleForm should not be valid when empty', () => {
        component.titleFormControl.setValue('');
        expect(component.titleFormControl.valid).toEqual(false);
    });

    it('titleForm should not be valid when input is not an appropriate string', () => {
        component.titleFormControl.setValue('!@#$%^bonjour');
        expect(component.titleFormControl.valid).toEqual(false);
    });

    it('titleForm should not be valid when the string length exceeds the limit (25)', () => {
        component.titleFormControl.setValue('123456789012345678901234567');
        expect(component.titleFormControl.valid).toEqual(false);
    });

    it('titleForm should be valid when the title follows the restrictions', () => {
        component.titleFormControl.setValue('bonjour');
        expect(component.titleFormControl.valid).toEqual(true);
    });
});
