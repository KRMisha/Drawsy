import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { ToolPencilService } from '@app/tools/services/brushes/tool-pencil.service';

describe('ToolPencilService', () => {
    beforeEach(() => {
        const rendererSpyObj = jasmine.createSpyObj('Renderer2', ['']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(rendererSpyObj);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: {} as DrawingService },
                { provide: ColorService, useValue: {} as ColorService },
                { provide: HistoryService, useValue: {} as HistoryService },
            ],
        });
    });

    it('should be created', () => {
        const service: ToolPencilService = TestBed.inject(ToolPencilService);
        expect(service).toBeTruthy();
    });
});
