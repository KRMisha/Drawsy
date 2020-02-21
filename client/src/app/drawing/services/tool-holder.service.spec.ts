import { TestBed } from '@angular/core/testing';
import { ToolPaintbrushService } from '../../tools/brushes/tool-paintbrush/tool-paintbrush.service';
import { ToolPencilService } from '../../tools/brushes/tool-pencil/tool-pencil.service';
import { ToolLineService } from '../../tools/tool-line/tool-line.service';
import { ToolRectangleService } from '../../tools/tool-rectangle/tool-rectangle.service';
import { ToolHolderService } from './tool-holder.service';

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
