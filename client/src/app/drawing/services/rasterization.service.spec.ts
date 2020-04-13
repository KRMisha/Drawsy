import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Vec2 } from '@app/shared/classes/vec2';

// tslint:disable: no-string-literal

describe('RasterizationService', () => {
    let service: RasterizationService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getBoundingClientRect']);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: drawingRootSpyObj,
            elements: [],
        });

        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });
        service = TestBed.inject(RasterizationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getCanvasFromSvgRoot should return a new canvas created from a source svg', async () => {
        const drawingDimensions: Vec2 = { x: 32, y: 32 };

        const outerHtmlMock = 'I love HTML!';
        const svgRootSpyObj = jasmine.createSpyObj('SVGSVGElement', [], {
            viewBox: {
                baseVal: {
                    width: drawingDimensions.x,
                    height: drawingDimensions.y,
                },
            },
            outerHTML: outerHtmlMock,
        });

        const canvasContextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['drawImage']);
        const canvasSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['getContext']);
        canvasSpyObj.getContext.and.returnValue(canvasContextSpyObj);
        renderer2SpyObj.createElement.and.returnValue(canvasSpyObj);

        const base64svgMock =
            'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CiAgICA8cmVjdCB4PSI' +
            'wIiB5PSIwIiB3aWR0aD0iMiIgaGVpZ2h0PSIyNCIgLz4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyIi' +
            'AvPgogICAgPHJlY3QgeD0iMCIgeT0iMjIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyIiAvPgogICAgPHJlY3QgeD0iMjIiIHk9IjAiIHdpZ' +
            'HRoPSIyIiBoZWlnaHQ9IjI0IiAvPgo8L3N2Zz4K';
        const btoaSpy = spyOn(window, 'btoa').and.returnValue(base64svgMock);

        const canvas = await service.getCanvasFromSvgRoot(svgRootSpyObj);

        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('canvas');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(canvasSpyObj, 'width', drawingDimensions.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(canvasSpyObj, 'height', drawingDimensions.y.toString());
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(btoaSpy).toHaveBeenCalledWith(outerHtmlMock);
        expect(canvasContextSpyObj.drawImage).toHaveBeenCalledWith(jasmine.any(Image), 0, 0);
        expect(canvas).toBeTruthy();
    });
});
