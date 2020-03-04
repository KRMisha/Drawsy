import { TestBed } from '@angular/core/testing';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';
import { ToolHolderService } from '@app/tools/services/shapes/tool-holder.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';
import { ToolLineService } from '@app/tools/services/tool-line.service';

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
