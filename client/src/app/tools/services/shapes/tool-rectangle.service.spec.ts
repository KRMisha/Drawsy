import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolRectangleService } from '@app/tools/services/shapes/tool-rectangle.service';

fdescribe('Tool-Rectangle', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolRectangle: ToolRectangleService;
    beforeEach(() => {
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        const drawingServiceStub = {} as DrawingService;

        const colorServiceStub = {} as ColorService;

        const commandServiceStub = {} as CommandService;
        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
                { provide: CommandService, useValue: commandServiceStub },
            ],
        }).compileComponents();
        toolRectangle = TestBed.inject(ToolRectangleService);
    });

    it('should create an instance', () => {
        expect(toolRectangle).toBeTruthy();
    });

    it('#getShapeString should return the string "rect"', () => {
        const shapeString = toolRectangle['getShapeString'](); // tslint:disable-line: no-string-literal
        expect(shapeString).toEqual('rect');
    });

    it('#updateShape should make the appropriate calls to renderer.setAttribute', () => {
        const shapeArea = { x: 10, y: 10, width: 100, height: 100 } as Rect;
        const scale = { x: 1, y: 1 } as Vec2;
        const shape = {} as SVGElement;
        toolRectangle['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'x', shapeArea.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'y', shapeArea.x.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'width', shapeArea.width.toString());
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'height', shapeArea.height.toString());
    });
});
