import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Color } from '@app/shared/classes/color';
import { ToolPaintbrushService } from '@app/tools/services/brushes/tool-paintbrush.service';

// tslint:disable: no-string-literal

const path = {} as SVGPathElement;

describe('ToolPaintbrushService', () => {
    let service: ToolPaintbrushService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let colorSpyObj: jasmine.SpyObj<Color>;

    const rgbaStringValue = 'rgba(69, 69, 69, 1)';
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['createElement', 'setAttribute']);
        renderer2SpyObj.createElement.and.returnValue(path);

        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(rgbaStringValue);

        const colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: colorSpyObj,
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: jasmine.createSpyObj('DrawingService', ['addElement']) },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: HistoryService, useValue: jasmine.createSpyObj('HistoryService', ['undo', 'redo']) },
            ],
        });

        service = TestBed.inject(ToolPaintbrushService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#createPath should create a path with a filter attribute', () => {
        const createPathSpy = spyOn<any>(service, 'createPath').and.callThrough(); // tslint:disable-line: no-any
        service.settings.brushTexture = 0;

        service['createPath']();

        expect(createPathSpy).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(path, 'filter', 'url(#brushTexture0)');
    });
});
