import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { ToolPolygonService } from '@app/tools/services/shapes/tool-polygon.service';

describe('ToolPolygonService', () => {
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let toolPolygon: ToolPolygonService;
    beforeEach(() => {
        const drawingServiceStub = {} as DrawingService;
        const colorServiceStub = {} as ColorService;
        const commandServiceStub = {} as CommandService;
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);

        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ColorService, useValue: colorServiceStub },
                { provide: CommandService, useValue: commandServiceStub },
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
            ],
        });
        toolPolygon = TestBed.inject(ToolPolygonService);
    });

    it('should be created', () => {
        expect(toolPolygon).toBeTruthy();
    });

    it('#getShapeString should return string "polygon"', () => {
        const shapeString = toolPolygon['getShapeString'](); // tslint:disable-line: no-string-literal
        expect(shapeString).toEqual('polygon');
    });

    it('#updateShape should call renderer.setAttribute with the appropriate parameters', () => {
        const shape = {} as SVGElement;
        toolPolygon['shape'] = shape; // tslint:disable-line: no-string-literal

        const toolSettings = new Map<ToolSetting, number>();
        toolSettings.set(ToolSetting.PolygonSideCount, 3); // tslint:disable-line: no-magic-numbers
        toolPolygon['toolSettings'] = toolSettings; // tslint:disable-line: no-string-literal

        const pointString = '5, 0 9.330127018922195, 7.499999999999999 0.6698729810778072, 7.500000000000002 ';

        const shapeArea = { x: 0, y: 0, width: 10, height: 10} as Rect;
        const scale = { x: 1, y: 1 } as Vec2;

        toolPolygon['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });
});
