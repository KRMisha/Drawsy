import { TestBed } from '@angular/core/testing';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';
import { ToolPolygonService } from '@app/tools/services/shapes/tool-polygon.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { ToolEraserService } from '@app/tools/services/tool-eraser.service';
import { ToolEyedropperService } from '@app/tools/services/tool-eyedropper.service';
import { ToolFillService } from '@app/tools/services/tool-fill.service';
import { ToolHolderService } from '@app/tools/services/tool-holder.service';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { ToolRecolorService } from '@app/tools/services/tool-recolor.service';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';

describe('ToolHolderService', () => {
    const toolPencilServiceMock = {} as ToolPencilService;
    const toolPaintbrushServiceMock = {} as ToolPaintbrushService;
    const toolLineServiceMock = {} as ToolLineService;
    const toolSprayCanServiceMock = {} as ToolSprayCanService;
    const toolRectangleServiceMock = {} as ToolRectangleService;
    const toolEllipseServiceMock = {} as ToolEllipseService;
    const toolPolygonServiceMock = {} as ToolPolygonService;
    const toolFillServiceMock = {} as ToolFillService;
    const toolEyedropperServiceMock = {} as ToolEyedropperService;
    const toolRecolorServiceMock = {} as ToolRecolorService;
    const toolSelectionServiceMock = {} as ToolSelectionService;
    const toolEraserServiceMock = {} as ToolEraserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ToolPencilService, useValue: toolPencilServiceMock },
                { provide: ToolPaintbrushService, useValue: toolPaintbrushServiceMock },
                { provide: ToolLineService, useValue: toolLineServiceMock },
                { provide: ToolSprayCanService, useValue: toolSprayCanServiceMock },
                { provide: ToolRectangleService, useValue: toolRectangleServiceMock },
                { provide: ToolEllipseService, useValue: toolEllipseServiceMock },
                { provide: ToolPolygonService, useValue: toolPolygonServiceMock },
                { provide: ToolFillService, useValue: toolFillServiceMock },
                { provide: ToolEyedropperService, useValue: toolEyedropperServiceMock },
                { provide: ToolRecolorService, useValue: toolRecolorServiceMock },
                { provide: ToolSelectionService, useValue: toolSelectionServiceMock },
                { provide: ToolEraserService, useValue: toolEraserServiceMock },
            ],
        });
    });

    it('should be created', () => {
        const service: ToolHolderService = TestBed.inject(ToolHolderService);
        expect(service).toBeTruthy();
    });
});
