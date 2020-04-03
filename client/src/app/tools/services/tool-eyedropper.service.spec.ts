import { RendererFactory2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { RasterizationService } from '@app/drawing/services/rasterization.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { Tool } from '@app/tools/services/tool';
import { ToolEyedropperService } from '@app/tools/services/tool-eyedropper.service';

// tslint:disable: no-magic-numbers

describe('ToolEyedropperService', () => {
    let service: ToolEyedropperService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorServiceMock: ColorService;
    let canvasSpyObj: jasmine.SpyObj<HTMLCanvasElement>;
    let canvasContextSpyObj: jasmine.SpyObj<CanvasRenderingContext2D>;
    let rasterizationServiceSpyObj: jasmine.SpyObj<RasterizationService>;

    const drawingDimensions: Vec2 = { x: 2, y: 2 };
    const rgbaComponents = [32, 64, 128, 128];
    const expectedColor = Color.fromRgba(rgbaComponents[0], rgbaComponents[1], rgbaComponents[2], rgbaComponents[3] / Color.maxRgb);

    beforeEach(() => {
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], {
            drawingRoot: '',
            dimensions: drawingDimensions,
        });

        colorServiceMock = ({
            primaryColor: undefined,
            secondaryColor: undefined,
        } as unknown) as ColorService;

        canvasContextSpyObj = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        canvasContextSpyObj.getImageData.and.returnValue(({
            data: [0, 0, 0, 0, ...rgbaComponents, 0, 0, 0, 0, 0, 0, 0, 0],
        } as unknown) as ImageData);

        canvasSpyObj = jasmine.createSpyObj('HTMLCanvasElement', ['getContext'], {
            width: drawingDimensions.x,
            height: drawingDimensions.y,
        });
        canvasSpyObj.getContext.and.returnValue(canvasContextSpyObj);

        rasterizationServiceSpyObj = jasmine.createSpyObj('RasterizationService', ['getCanvasFromSvgRoot']);
        rasterizationServiceSpyObj.getCanvasFromSvgRoot.and.returnValue(Promise.resolve(canvasSpyObj));

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: jasmine.createSpyObj('RendererFactory2', ['createRenderer']) },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceMock },
                { provide: CommandService, useValue: jasmine.createSpyObj('ColorService', ['']) },
                { provide: RasterizationService, useValue: rasterizationServiceSpyObj },
            ],
        });

        Tool.mousePosition = { x: 1, y: 0 };

        service = TestBed.inject(ToolEyedropperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should not set any color in the drawingService if the mouse is clicked outside the drawing', () => {
        Tool.isMouseInsideDrawing = false;
        service.onMouseDown({} as MouseEvent);
        expect(colorServiceMock.primaryColor).toBeUndefined();
        expect(colorServiceMock.secondaryColor).toBeUndefined();
    });

    it("#onMouseDown should set the drawingService's primary color on a left click inside the drawing", fakeAsync(() => {
        Tool.isMouseInsideDrawing = true;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        tick();
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingServiceSpyObj.drawingRoot);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalledWith(0, 0, drawingDimensions.x, drawingDimensions.y);
        expect(colorServiceMock.primaryColor).toEqual(expectedColor);
        expect(colorServiceMock.secondaryColor).toBeUndefined();
    }));

    it("#onMouseDown should set the drawingService's secondary color on a right click inside the drawing", fakeAsync(() => {
        Tool.isMouseInsideDrawing = true;
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        tick();
        expect(rasterizationServiceSpyObj.getCanvasFromSvgRoot).toHaveBeenCalledWith(drawingServiceSpyObj.drawingRoot);
        expect(canvasSpyObj.getContext).toHaveBeenCalledWith('2d');
        expect(canvasContextSpyObj.getImageData).toHaveBeenCalledWith(0, 0, drawingDimensions.x, drawingDimensions.y);
        expect(colorServiceMock.primaryColor).toBeUndefined();
        expect(colorServiceMock.secondaryColor).toEqual(expectedColor);
    }));
});
