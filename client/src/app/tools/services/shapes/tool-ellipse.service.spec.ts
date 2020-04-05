import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolEllipseService } from '@app/tools/services/shapes/tool-ellipse.service';

describe('ToolEllipseService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolEllipse: ToolEllipseService;

    beforeEach(() => {
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        const drawingServiceStub = {} as DrawingService;

        const colorServiceStub = {} as ColorService;

        const historyServiceStub = {} as HistoryService;
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
                { provide: HistoryService, useValue: historyServiceStub },
            ],
        }).compileComponents();

        toolEllipse = TestBed.inject(ToolEllipseService);
    });

    it('should be created', () => {
        expect(toolEllipse).toBeTruthy();
    });

    it('#getShapeString should return the string "ellipse"', () => {
        const shapeString = toolEllipse['getShapeString'](); // tslint:disable-line: no-string-literal
        expect(shapeString).toEqual('ellipse');
    });

    it('#updateShape should make the appropriate calls to renderer.setAttribute', () => {
        const shapeArea: Rect = { x: 10, y: 10, width: 100, height: 100 };
        const scale: Vec2 = { x: 1, y: 1 };
        const shape = {} as SVGGraphicsElement;
        toolEllipse['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'cx', `${shapeArea.x + shapeArea.width / 2}`);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'cy', `${shapeArea.y + shapeArea.height / 2}`);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'rx', `${shapeArea.width / 2}`);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'ry', `${shapeArea.height / 2}`);
    });
});
