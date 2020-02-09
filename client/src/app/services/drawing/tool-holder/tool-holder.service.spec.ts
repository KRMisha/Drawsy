import { TestBed } from '@angular/core/testing';

import { ToolBrushService } from '../tools/tool-brush/tool-brush.service';
import { ToolLineService } from '../tools/tool-line/tool-line.service';
import { ToolPencilService } from '../tools/tool-pencil/tool-pencil.service';
import { ToolRectangleService } from '../tools/tool-rectangle/tool-rectangle.service';
import { ToolHolderService } from './tool-holder.service';

class MockTool {};

fdescribe('ToolHolderService', () => {
    beforeEach(() => {
        const mockToolPencilService = new MockTool();
        const mockToolBrushService = new MockTool();
        const mockToolLineService = new MockTool();
        const mockToolRectangleService = new MockTool();
        TestBed.configureTestingModule({
            providers: [
                {provide: ToolPencilService, useValue: mockToolPencilService},
                {provide: ToolBrushService, useValue: mockToolBrushService},
                {provide: ToolLineService, useValue: mockToolLineService},
                {provide: ToolRectangleService, useValue: mockToolRectangleService},
            ]
        })
    });

    it('should be created', () => {
        const service: ToolHolderService = TestBed.get(ToolHolderService);
        expect(service).toBeTruthy();
    });


});
