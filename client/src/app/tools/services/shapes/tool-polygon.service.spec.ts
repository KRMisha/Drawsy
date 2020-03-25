import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Rect } from '@app/classes/rect';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { ToolSetting } from '@app/tools/enums/tool-setting.enum';
import { ToolPolygonService } from '@app/tools/services/shapes/tool-polygon.service';

fdescribe('ToolPolygonService', () => {
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

    it("#updateShape should call renderer's setAttribute with the appropriate parameters when the number of sides is the minimum", () => {
        const shape = {} as SVGElement;
        const toolSettings = new Map<ToolSetting, number>();
        // tslint:disable: no-string-literal
        toolPolygon['shape'] = shape;
        toolPolygon['toolSettings'] = toolSettings;
        // tslint:enable: no-string-literal
        toolSettings.set(ToolSetting.PolygonSideCount, 3); // tslint:disable-line: no-magic-numbers

        const pointString = '5, 0 9.330127018922195, 7.499999999999999 0.6698729810778072, 7.500000000000002 ';

        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };

        toolPolygon['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });

    it("#updateShape should call renderer's setAttribute with the appropriate parameters for 6 sides", () => {
        const shape = {} as SVGElement;
        const toolSettings = new Map<ToolSetting, number>();
        // tslint:disable: no-string-literal
        toolPolygon['shape'] = shape;
        toolPolygon['toolSettings'] = toolSettings;
        // tslint:enable: no-string-literal
        toolSettings.set(ToolSetting.PolygonSideCount, 6); // tslint:disable-line: no-magic-numbers

        const pointString =
            '5, 0 9.330127018922193, 2.5 9.330127018922195, 7.499999999999999 5.000000000000002, 10 0.6698729810778072, 7.500000000000002 0.6698729810778046, 2.500000000000003 ';

        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };

        toolPolygon['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });

    it("#updateShape should call renderer's setAttribute with the appropriate parameters when the number of sides is the maximum", () => {
        const shape = {} as SVGElement;
        const toolSettings = new Map<ToolSetting, number>();
        // tslint:disable: no-string-literal
        toolPolygon['shape'] = shape;
        toolPolygon['toolSettings'] = toolSettings;
        toolSettings.set(ToolSetting.PolygonSideCount, 12); // tslint:disable-line: no-magic-numbers
        // tslint:enable: no-string-literal

        const pointString =
            '5, 0 7.5, 0.6698729810778064 9.330127018922193, 2.4999999999999996 10, 4.999999999999999 9.330127018922195, 7.499999999999999 7.500000000000002, 9.330127018922193 5.000000000000003, 10 2.5000000000000027, 9.330127018922195 0.669872981077809, 7.5000000000000036 0, 5.000000000000005 0.6698729810778037, 2.500000000000005 2.499999999999994, 0.6698729810778108 ';

        const shapeArea: Rect = { x: 0, y: 0, width: 10, height: 10 };
        const scale: Vec2 = { x: 1, y: 1 };

        toolPolygon['updateShape'](shapeArea, scale, shape); // tslint:disable-line: no-string-literal
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(shape, 'points', pointString);
    });
});
