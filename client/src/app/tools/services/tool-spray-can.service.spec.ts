import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { CommandService } from '@app/drawing/services/command.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ToolSprayCanService } from '@app/tools/services/tool-spray-can.service';
import { Tool } from './tool';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ToolSprayCanService', () => {
    let service: ToolSprayCanService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let colorSpyObj: jasmine.SpyObj<Color>;
    let commandServiceSpyObj: jasmine.SpyObj<CommandService>;

    const rgbaStringValue = 'rgba(1, 1, 1, 1)';
    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'appendChild']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement']);

        colorSpyObj = jasmine.createSpyObj('Color', ['toRgbaString']);
        colorSpyObj.toRgbaString.and.returnValue(rgbaStringValue);
        const colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColor: colorSpyObj,
        });

        commandServiceSpyObj = jasmine.createSpyObj('CommandService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: CommandService, useValue: commandServiceSpyObj },
            ],
        });
        service = TestBed.inject(ToolSprayCanService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should define sprayDiameter and sprayRate settings', () => {
        expect(service.settings.sprayDiameter).toBeTruthy();
        expect(service.settings.sprayRate).toBeTruthy();
    });

    it('#onMouseDown should call #startSpraying if the mouse is insideDrawing and the click is a LeftClick', () => {
        Tool.isMouseInsideDrawing = true;
        const eventMock = { button: MouseButton.Left } as MouseEvent;
        const startSprayingSpy = spyOn<any>(service, 'startSpraying');

        service.onMouseDown(eventMock);
        expect(startSprayingSpy).toHaveBeenCalled();
    });

    it('#onMouseDown should not call #startSpraying if the mouse is  not insideDrawing or the click is a RightClick', () => {
        Tool.isMouseInsideDrawing = true;
        const eventMock = { button: MouseButton.Right } as MouseEvent;
        const startSprayingSpy = spyOn<any>(service, 'startSpraying');

        service.onMouseDown(eventMock);
        expect(startSprayingSpy).not.toHaveBeenCalled();
    });

    it('#onMouseDown should not call #startSpraying if the mouse is  not insideDrawing or the click is a RightClick', () => {
        Tool.isMouseInsideDrawing = false;
        const eventMock = { button: MouseButton.Left } as MouseEvent;
        const startSprayingSpy = spyOn<any>(service, 'startSpraying');

        service.onMouseDown(eventMock);
        expect(startSprayingSpy).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call #stopSpraying if event button is Left', () => {
        const stopSprayingSpy = spyOn<any>(service, 'stopSpraying');

        const eventMock = { button: MouseButton.Left } as MouseEvent;

        service.onMouseUp(eventMock);
        expect(stopSprayingSpy).toHaveBeenCalled();
    });

    it('#onMouseUp should not call #stopSpraying if event button is Right', () => {
        const stopSprayingSpy = spyOn<any>(service, 'stopSpraying');
        const eventMock = { button: MouseButton.Right } as MouseEvent;

        service.onMouseUp(eventMock);
        expect(stopSprayingSpy).not.toHaveBeenCalled();
    });

    it('#onLeave should call #stopSpraying', () => {
        const stopSprayingSpy = spyOn<any>(service, 'stopSpraying');
        const eventMock = {} as MouseEvent;

        service.onLeave(eventMock);
        expect(stopSprayingSpy).toHaveBeenCalled();
    });

    it("#onPrimaryColorChange should set the group's fill value if it is not undefined", () => {
        const groupStub = {} as SVGGElement;
        service['group'] = groupStub;

        service.onPrimaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(groupStub, 'fill', rgbaStringValue);
    });

    it("#onPrimaryColorChange should not set the group's fill value if it is undefined", () => {
        service['group'] = undefined;
        service.onPrimaryColorChange(colorSpyObj);
        expect(renderer2SpyObj.setAttribute).not.toHaveBeenCalled();
    });

    it('#onToolDeselection should call #stopSpraying', () => {
        const stopSprayingSpy = spyOn<any>(service, 'stopSpraying');
        service.onToolDeselection();
        expect(stopSprayingSpy).toHaveBeenCalled();
    });

    it('#startSpraying should use setInterval to call #createSpray at an interval depending of the sprayRate', () => {
        jasmine.clock().install();
        const oneSecondInMilliseconds = 1000;
        const sprayRateValue = 100;
        service.settings.sprayRate = sprayRateValue;
        const createSpraySpy = spyOn<any>(service, 'createSpray');

        service['startSpraying']();
        let callCount = 0;
        expect(createSpraySpy).toHaveBeenCalledTimes(callCount++);
        const intervalDuration = oneSecondInMilliseconds / sprayRateValue;
        jasmine.clock().tick(intervalDuration);
        expect(createSpraySpy).toHaveBeenCalledTimes(callCount++);
        jasmine.clock().tick(intervalDuration);
        expect(createSpraySpy).toHaveBeenCalledTimes(callCount++);
        jasmine.clock().tick(intervalDuration);
        expect(createSpraySpy).toHaveBeenCalledTimes(callCount++);
        jasmine.clock().uninstall();
    });

    it("#createSpray should call #createRandomPoint in loop that depends on the tool's sprayDensity", () => {
        const createRandomPointSpy = spyOn<any>(service, 'createRandomPoint');
        const sprayDiameterValue = 20;
        service.settings.sprayDiameter = sprayDiameterValue;
        const expectedSprayDensity = sprayDiameterValue / 2;
        service['createSpray']();
        expect(createRandomPointSpy).toHaveBeenCalledTimes(expectedSprayDensity);
    });

    it('#createRandomPoint should use #createCircle and append the element using renderer2', () => {
        const createCircleSpy = spyOn<any>(service, 'createCircle');
        service['createRandomPoint']();
        expect(createCircleSpy).toHaveBeenCalled();
        expect(renderer2SpyObj.appendChild).toHaveBeenCalled();
    });

    it('#createCircle should use renderer to create a circle and set its attributes then return the new circle', () => {
        const offset = 10;
        const mousePosition = 10;
        Tool.mousePosition = { x: mousePosition, y: mousePosition };
        const randomOffset: Vec2 = { x: offset, y: offset };
        const circleMock = {} as SVGCircleElement;
        renderer2SpyObj.createElement.and.returnValue(circleMock);

        const actualValue = service['createCircle'](randomOffset);
        expect(renderer2SpyObj.createElement).toHaveBeenCalledWith('circle', 'svg');
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(circleMock, 'cx', `${Tool.mousePosition.x + randomOffset.x}`);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(circleMock, 'cy', `${Tool.mousePosition.y + randomOffset.y}`);
        expect(renderer2SpyObj.setAttribute).toHaveBeenCalledWith(circleMock, 'r', '1');
        expect(actualValue).toEqual(circleMock);
    });

    it('#stopSpraying should return early if the group is undefined', () => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        service['group'] = undefined;
        service['stopSpraying']();
        expect(clearIntervalSpy).not.toHaveBeenCalled();
        expect(commandServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#stopSpraying should clear the interval and add the command when the group is defined', () => {
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        const groupMock = {} as SVGGElement;
        const intervalIdValue = 10;
        service['intervalId'] = intervalIdValue;
        service['group'] = groupMock;

        service['stopSpraying']();
        expect(clearIntervalSpy).toHaveBeenCalled();
        expect(commandServiceSpyObj.addCommand).toHaveBeenCalled();
    });
});
