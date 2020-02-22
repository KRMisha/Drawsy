import { TestBed } from '@angular/core/testing';
import { ToolPaintbrushService } from './brushes/tool-paintbrush/tool-paintbrush.service';
import { ToolPencilService } from './brushes/tool-pencil/tool-pencil.service';
import { ToolHolderService } from './tool-holder.service';
import { ToolLineService } from './tool-line/tool-line.service';
import { ToolRectangleService } from './tool-rectangle/tool-rectangle.service';

describe('ToolHolderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ToolPencilService, useValue: {} as ToolPencilService },
                { provide: ToolPaintbrushService, useValue: {} as ToolPaintbrushService },
                { provide: ToolLineService, useValue: {} as ToolLineService },
                { provide: ToolRectangleService, useValue: {} as ToolRectangleService },
            ],
        });
    });

    it('should be created', () => {
        const service: ToolHolderService = TestBed.get(ToolHolderService);
        expect(service).toBeTruthy();
    });
});
