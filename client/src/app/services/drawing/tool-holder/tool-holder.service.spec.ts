import { TestBed } from '@angular/core/testing';

import { ToolPaintbrushService } from '../tools/brushes/tool-paintbrush/tool-paintbrush.service';
import { ToolPencilService } from '../tools/brushes/tool-pencil/tool-pencil.service';
import { ToolLineService } from '../tools/tool-line/tool-line.service';
import { ToolRectangleService } from '../tools/tool-rectangle/tool-rectangle.service';
import { ToolHolderService } from './tool-holder.service';

class MockTool {}

describe('ToolHolderService', () => {
    beforeEach(() => {
        const mockToolPencilService = new MockTool();
        const mockToolBrushService = new MockTool();
        const mockToolLineService = new MockTool();
        const mockToolRectangleService = new MockTool();
        TestBed.configureTestingModule({
            providers: [
                { provide: ToolPaintbrushService, useValue: mockToolBrushService },
                { provide: ToolPencilService, useValue: mockToolPencilService },
                { provide: ToolLineService, useValue: mockToolLineService },
                { provide: ToolRectangleService, useValue: mockToolRectangleService },
            ],
        });
    });

    it('should be created', () => {
        const service: ToolHolderService = TestBed.get(ToolHolderService);
        expect(service).toBeTruthy();
    });
});
