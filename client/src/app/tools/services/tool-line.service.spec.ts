import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolLineService } from '@app/tools/services/tool-line.service';
import { Tool } from './tool';

// tslint:disable: max-classes-per-file
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-line-length
// tslint:disable: no-any

describe('ToolLineService', () => {
    let service: ToolLineService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let primaryColorSpyObj: jasmine.SpyObj<Color>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;

    const primaryRgbaStringValue = 'rgba(69, 69, 69, 1)';

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild', 'removeChild']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement', 'addUiElement', 'removeUiElement']);

        primaryColorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString', 'clone']);
        primaryColorSpyObj.toRgbaString.and.returnValue(primaryRgbaStringValue);
        primaryColorSpyObj.clone.and.returnValue(primaryColorSpyObj);

        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: primaryColorSpyObj,
        });

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolLineService);

        service['renderer'] = renderer2SpyObj;
        service['nextPoint'] = { x: 69, y: 420 };
        service['junctionPoints'] = [];
        service['points'] = [420, 69, 666, 666];
        service['lastPoint'] = { x: 0, y: 0 };

        Tool.isMouseInsideDrawing = true;
        Tool.mousePosition = { x: 0, y: 0 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#calculateNextPointPosition should return mouse position if user is not drawing', () => {
        const mousePosition = { x: 10, y: 10 };
        expect(ToolLineService.calculateNextPointPosition({} as Vec2, mousePosition, true, false)).toEqual(mousePosition);
    });

    it('#calculateNextPointPosition should return mouse position if shift is not pressed', () => {
        const mousePosition = { x: 10, y: 10 };
        expect(ToolLineService.calculateNextPointPosition({} as Vec2, mousePosition, false, true)).toEqual(mousePosition);
    });

    it('#calculateNextPointPosition should return a relative horizontal mouse position to its previous point if angle is close to horizontal', () => {
        expect(ToolLineService.calculateNextPointPosition({ x: 0, y: 10 }, { x: 10, y: 12 }, true, true)).toEqual({ x: 10, y: 10 });
        expect(ToolLineService.calculateNextPointPosition({ x: 10, y: 10 }, { x: 0, y: 12 }, true, true)).toEqual({ x: 0, y: 10 });
    });

    it('#calculateNextPointPosition should return a relative vertical mouse position to its previous point if angle is close to vertical', () => {
        expect(ToolLineService.calculateNextPointPosition({ x: 0, y: 0 }, { x: 2, y: 10 }, true, true)).toEqual({ x: 0, y: 10 });
        expect(ToolLineService.calculateNextPointPosition({ x: 2, y: 10 }, { x: 0, y: 0 }, true, true)).toEqual({ x: 2, y: 0 });
    });

    it('#calculateNextPointPosition should return a relative diagonal mouse position to its previous point if angle is close to diagonal', () => {
        const value = ToolLineService.calculateNextPointPosition({ x: 0, y: 0 }, { x: 10, y: 11 }, true, true);
        expect(value.x).toBeCloseTo(10);
        expect(value.y).toBeCloseTo(10);
    });

    it('#onMouseMove should call updateNextPointPosition', () => {
        const updateNextPointPositionSpy = spyOn<any>(service, 'updateNextPointPosition');
        service.onMouseMove();
        expect(updateNextPointPositionSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should stop drawing if mouse is outside drawing', () => {
        Tool.isMouseInsideDrawing = false;
        const stopDrawingSpy = spyOn<any>(service, 'stopDrawing');
        service.onMouseDown({} as MouseEvent);
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should do nothin if mouse button is not left', () => {
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onMouseDown should start a drawing if user is not drawing', () => {
        service['isCurrentlyDrawing'] = false;
        const startDrawingSpy = spyOn<any>(service, 'startDrawingShape');
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(startDrawingSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should not start a drawing if user currently drawing', () => {
        service['isCurrentlyDrawing'] = true;
        const startDrawingSpy = spyOn<any>(service, 'startDrawingShape');
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(startDrawingSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should place junctions if junctions are enabled', () => {
        service['isJunctionEnabled'] = true;
        spyOn<any>(service, 'startDrawingShape');
        const createNewJunctionSpy = spyOn<any>(service, 'createNewJunction');
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(createNewJunctionSpy).toHaveBeenCalled();
    });

    it('#onMouseDoubleClick should not remove junction if none exist', () => {
        service.onMouseDoubleClick({} as MouseEvent);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it('#onMouseDoubleClick should remove last junction if some exist', () => {
        const svgCircleElement = jasmine.createSpyObj('SVGCircleElement', [], {
            r: 0,
        });
        service['junctionPoints'] = [svgCircleElement, svgCircleElement];
        service['isShiftDown'] = true;
        service.onMouseDoubleClick({} as MouseEvent);
        expect(renderer2SpyObj.removeChild).toHaveBeenCalled();
    });

    it('#onMouseDoubleClick should merge first point and last point if they are close enough', () => {
        const svgCircleElement1 = jasmine.createSpyObj('SVGCircleElement', [], { r: 0 });
        const svgCircleElement2 = jasmine.createSpyObj('SVGCircleElement', [], { r: 0 });
        service['junctionPoints'] = [svgCircleElement1, svgCircleElement2];
        service.onMouseDoubleClick({} as MouseEvent);
        expect(renderer2SpyObj.removeChild).toHaveBeenCalled();
    });

    it('#onMouseDoubleClick not should merge first point and last point if they are far enough', () => {
        service['points'] = [0, 0, 20, 20, 30, 30];
        service.onMouseDoubleClick({} as MouseEvent);
        expect(renderer2SpyObj.removeChild).not.toHaveBeenCalled();
    });

    it('#onKeyDown should remove current element being drawn if escape is pressed', () => {
        service['isCurrentlyDrawing'] = true;
        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });

    it('#onKeyDown should not remove current element if nothing is being drawn if escape is pressed', () => {
        service['isCurrentlyDrawing'] = false;
        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);
        expect(drawingServiceSpyObj.removeElement).not.toHaveBeenCalled();
    });

    it('#onKeyDown should update next point position if shift is being pressed', () => {
        const updateNextPointPositionSpy = spyOn<any>(service, 'updateNextPointPosition');
        service.onKeyDown({ key: 'Shift' } as KeyboardEvent);
        expect(updateNextPointPositionSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should update remove last point from line if backspace is being pressed', () => {
        const removeLastPointFromLineSpy = spyOn<any>(service, 'removeLastPointFromLine');
        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);
        expect(removeLastPointFromLineSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should update next point position if shift is being pressed', () => {
        const updateNextPointPositionSpy = spyOn<any>(service, 'updateNextPointPosition');
        service.onKeyUp({ key: 'Shift' } as KeyboardEvent);
        expect(updateNextPointPositionSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should do nothin if shift is not being pressed', () => {
        const updateNextPointPositionSpy = spyOn<any>(service, 'updateNextPointPosition');
        service.onKeyUp({ key: 'a' } as KeyboardEvent);
        expect(updateNextPointPositionSpy).not.toHaveBeenCalled();
    });

    it('#onPrimaryColorChange should do nothing if nothing is being drawn', () => {
        service['isCurrentlyDrawing'] = false;
        service.onPrimaryColorChange(primaryColorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onPrimaryColorChange change group color', () => {
        service['isCurrentlyDrawing'] = true;
        service.onPrimaryColorChange(primaryColorSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalled();
    });

    it('#onToolDeselection should stop drawing', () => {
        const stopDrawingSpy = spyOn<any>(service, 'stopDrawing');
        service.onToolDeselection();
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('#startDrawingShape should create new shape and use 0 diameter as data padding', () => {
        service['startDrawingShape']();
        expect(renderer2SpyObj.createElement).toHaveBeenCalled();
    });

    it('#startDrawingShape should create new shape and use junction diameter as data padding', () => {
        service['isJunctionEnabled'] = true;
        service['startDrawingShape']();
        expect(renderer2SpyObj.createElement).toHaveBeenCalled();
    });

    it('#stopDrawing should remove element if line is one point or less', () => {
        service['isCurrentlyDrawing'] = true;
        service['points'] = [69, 420];
        service['stopDrawing']();
        expect(drawingServiceSpyObj.removeElement).toHaveBeenCalled();
    });

    it('#removeLastPointFromLine should remove a point if there is more than one point', () => {
        service['isCurrentlyDrawing'] = true;
        service['points'] = [69, 420, 666, 666];
        service['removeLastPointFromLine']();
        expect(service['points'].length).toEqual(2);
    });

    it('#removeLastPointFromLine should not remove a point if there is not more than one point', () => {
        service['isCurrentlyDrawing'] = true;
        service['points'] = [69, 420];
        service['removeLastPointFromLine']();
        expect(service['points'].length).toEqual(2);
    });

    it('#removeLastPointFromLine should remove a point and a junction if there is more than one point', () => {
        service['isCurrentlyDrawing'] = true;
        service['points'] = [69, 420, 666, 666];
        const svgCircleElement = jasmine.createSpyObj('SVGCircleElement', [], {
            r: 0,
        });
        service['junctionPoints'] = [svgCircleElement, svgCircleElement];
        service['removeLastPointFromLine']();
        expect(service['points'].length).toEqual(2);
        expect(service['junctionPoints'].length).toEqual(1);
    });

    it('#createNewJunction should push a new point', () => {
        const pushSpy = spyOn<any>(service['junctionPoints'], 'push');
        service['createNewJunction']();
        expect(pushSpy).toHaveBeenCalled();
    });
});
