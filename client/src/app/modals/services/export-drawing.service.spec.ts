import { TestBed } from '@angular/core/testing';
import { FileType } from '@app/drawing/enums/file-type.enum';
import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ExportDrawingService } from '@app/modals/services/export-drawing.service';

describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let drawingSerializerServiceSpyObj: jasmine.SpyObj<DrawingSerializerService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    const drawingTitle = 'DrawingTitle';
    beforeEach(() => {
        drawingSerializerServiceSpyObj = jasmine.createSpyObj('DrawingSerializerService', ['exportDrawing']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], { title: drawingTitle });
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: DrawingSerializerService, useValue: drawingSerializerServiceSpyObj },
            ],
        });
        service = TestBed.inject(ExportDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#exportDrawing should forward the drawing's exporting call to the the DrawingSerializerService", () => {
        const drawingRootStub = {} as SVGSVGElement;
        const fileType = FileType.Jpeg;
        service.exportDrawing(drawingRootStub, fileType);
        expect(drawingSerializerServiceSpyObj.exportDrawing).toHaveBeenCalledWith(drawingRootStub, drawingServiceSpyObj.title, fileType);
    });
});
