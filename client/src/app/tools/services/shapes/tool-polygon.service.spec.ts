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

    it("#updateShape should call renderer's setAttribute with the appropriate parameters for the maximum number of sides", () => {
        const shape = {} as SVGElement;
        const toolSettings = new Map<ToolSetting, number>();
        toolSettings.set(ToolSetting.PolygonSideCount, 12); // tslint:disable-line: no-magic-numbers

        const point: Vec2 = { x: 1, y: 1 };
        const pointArray: Vec2[] = [point, point, point, point, point, point, point, point, point, point, point, point];
        const getPolygonPointsSpy = spyOn<any>(toolPolygon, 'getPolygonPoints').and.returnValue(pointArray); // tslint:disable-line: no-any

        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };
        // tslint:disable: no-string-literal
        toolPolygon['shape'] = shape;
        toolPolygon['toolSettings'] = toolSettings;
        toolPolygon['updateShape'](shapeArea, scale, shape);
        // tslint:enable: no-string-literal
        const pointString = '1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 1, 1 ';

        expect(getPolygonPointsSpy).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });

    it("#updateShape should call renderer's setAttribute with the appropriate parameters for the minimum number of sides", () => {
        const shape = {} as SVGElement;
        const toolSettings = new Map<ToolSetting, number>();
        toolSettings.set(ToolSetting.PolygonSideCount, 3); // tslint:disable-line: no-magic-numbers

        const point: Vec2 = { x: 1, y: 1 };
        const pointArray: Vec2[] = [point, point, point];
        const getPolygonPointsSpy = spyOn<any>(toolPolygon, 'getPolygonPoints').and.returnValue(pointArray); // tslint:disable-line: no-any

        const pointString = '1, 1 1, 1 1, 1 ';

        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };
        // tslint:disable: no-string-literal
        toolPolygon['shape'] = shape;
        toolPolygon['toolSettings'] = toolSettings;
        toolPolygon['updateShape'](shapeArea, scale, shape);
        // tslint:enable: no-string-literal

        expect(getPolygonPointsSpy).toHaveBeenCalled();
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });

    it('#getPolygonPoints should return the correct points for a regular polygon', () => {
        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };

        const point1: Vec2 = { x: 5, y: 0 };
        const point2: Vec2 = { x: 10, y: 5 };
        const point3: Vec2 = { x: 5, y: 10 };
        const point4: Vec2 = { x: 0, y: 5 };
        const expectedPoints: Vec2[] = [point1, point2, point3, point4];

        // tslint:disable-next-line: no-string-literal no-magic-numbers
        const polygonPoints = toolPolygon['getPolygonPoints'](shapeArea, scale, 4);
        for (let i = 0; i < expectedPoints.length; i++) {
            expect(polygonPoints[i].x).toBeCloseTo(expectedPoints[i].x);
            expect(polygonPoints[i].y).toBeCloseTo(expectedPoints[i].y);
        }
    });
});
