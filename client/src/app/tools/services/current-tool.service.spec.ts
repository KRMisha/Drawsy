import { async, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Color } from '@app/shared/classes/color';
import { SvgClickEvent } from '@app/shared/classes/svg-click-event';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { CurrentToolService } from '@app/tools/services/current-tool.service';
import { Subject } from 'rxjs';
import { Tool } from './tool';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('CurrentToolService', () => {
    let service: CurrentToolService;
    let colorServiceSpyObj: jasmine.SpyObj<ColorService>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let currentToolSpyObj: jasmine.SpyObj<Tool>;
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;

    let primaryColorChangedSubject = new Subject<Color>();
    let secondaryColorChangedSubject = new Subject<Color>();
    let elementClickedSubject = new Subject<SvgClickEvent>();

    beforeEach(() => {
        primaryColorChangedSubject = new Subject<Color>();
        secondaryColorChangedSubject = new Subject<Color>();
        colorServiceSpyObj = jasmine.createSpyObj('ColorService', [], {
            primaryColorChanged$: primaryColorChangedSubject,
            secondaryColorChanged$: secondaryColorChangedSubject,
        });

        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getScreenCTM']);
        elementClickedSubject = new Subject<SvgClickEvent>();
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement', 'removeElement'], {
            drawingRoot: drawingRootSpyObj,
            elementClicked$: elementClickedSubject,
        });

        currentToolSpyObj = jasmine.createSpyObj('Tool', [
            'onMouseMove',
            'onMouseDown',
            'onMouseUp',
            'onMouseDoubleClick',
            'onKeyDown',
            'onKeyUp',
            'onEnter',
            'onLeave',
            'onPrimaryColorChange',
            'onSecondaryColorChange',
            'onElementClick',
            'update',
            'onToolSelection',
            'onToolDeselection',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: ColorService, useValue: colorServiceSpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
            ],
        });

        Tool.isLeftMouseButtonDown = false;
        Tool.isMouseInsideDrawing = false;

        service = TestBed.inject(CurrentToolService);
        service['_currentTool'] = currentToolSpyObj;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#constructor should subscribe to colorService's primary, secondary color changes and drawingService's elementClick", async(() => {
        const colorStub = {} as Color;
        const svgClickEventStub = {} as SvgClickEvent;

        primaryColorChangedSubject.next(colorStub);
        secondaryColorChangedSubject.next(colorStub);
        elementClickedSubject.next(svgClickEventStub);

        expect(currentToolSpyObj.onPrimaryColorChange).toHaveBeenCalledWith(colorStub);
        expect(currentToolSpyObj.onSecondaryColorChange).toHaveBeenCalledWith(colorStub);
        expect(currentToolSpyObj.onElementClick).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from its subscriptions', async(() => {
        const primaryColorChangedSubscriptionSpy = spyOn<any>(service['primaryColorChangedSubscription'], 'unsubscribe');
        const secondaryColorChangedSubscriptionSpy = spyOn<any>(service['secondaryColorChangedSubscription'], 'unsubscribe');
        const elementClickedSubscriptionSpy = spyOn<any>(service['elementClickedSubscription'], 'unsubscribe');

        service.ngOnDestroy();

        expect(primaryColorChangedSubscriptionSpy).toHaveBeenCalled();
        expect(secondaryColorChangedSubscriptionSpy).toHaveBeenCalled();
        expect(elementClickedSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#onMouseMove should update the mouse position and call the currentTool onMouseMove', () => {
        const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
        getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

        service.onMouseMove({} as MouseEvent);

        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
        expect(currentToolSpyObj.onMouseMove).toHaveBeenCalled();
    });

    it(
        '#onMouseDown should set isLeftMouseButtonDown to true if the event is a left click, update the mouse position and call' +
            ' the currentTool onMouseDown',
        () => {
            const leftClick = { button: MouseButton.Left } as MouseEvent;
            const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
            const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
            getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

            service.onMouseDown(leftClick);

            expect(Tool.isLeftMouseButtonDown).toEqual(true);
            expect(getMousePositionSpy).toHaveBeenCalled();
            expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
            expect(currentToolSpyObj.onMouseDown).toHaveBeenCalledWith(leftClick);
        }
    );

    it(
        '#onMouseDown should not change isLeftMouseButtonDown if the event is not a left click, update the mouse position and call' +
            ' the currentTool onMouseDown',
        () => {
            const rightClick = { button: MouseButton.Right } as MouseEvent;
            const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
            const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
            getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

            service.onMouseDown(rightClick);

            expect(Tool.isLeftMouseButtonDown).toEqual(false);
            expect(getMousePositionSpy).toHaveBeenCalled();
            expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
            expect(currentToolSpyObj.onMouseDown).toHaveBeenCalledWith(rightClick);
        }
    );

    it(
        '#onMouseUp should set isLeftMouseButtonDown to false if the event is a left click, update the mouse position and call' +
            ' the currentTool onMouseUp',
        () => {
            Tool.isLeftMouseButtonDown = true;
            const leftClick = { button: MouseButton.Left } as MouseEvent;
            const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
            const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
            getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

            service.onMouseUp(leftClick);

            expect(Tool.isLeftMouseButtonDown).toEqual(false);
            expect(getMousePositionSpy).toHaveBeenCalled();
            expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
            expect(currentToolSpyObj.onMouseUp).toHaveBeenCalledWith(leftClick);
        }
    );

    it(
        '#onMouseUp should not change isLeftMouseButtonDown if the event is not a left click, update the mouse position and call' +
            ' the currentTool onMouseUp',
        () => {
            Tool.isLeftMouseButtonDown = true;
            const rightClick = { button: MouseButton.Right } as MouseEvent;
            const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
            const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
            getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

            service.onMouseUp(rightClick);

            expect(Tool.isLeftMouseButtonDown).toEqual(true);
            expect(getMousePositionSpy).toHaveBeenCalled();
            expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
            expect(currentToolSpyObj.onMouseUp).toHaveBeenCalledWith(rightClick);
        }
    );

    it('#onMouseDoubleClick should update the mouse position and call the currentTool onMouseDoubleClick', () => {
        const mouseEvent = {} as MouseEvent;
        const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
        getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

        service.onMouseDoubleClick(mouseEvent);

        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
        expect(currentToolSpyObj.onMouseDoubleClick).toHaveBeenCalledWith(mouseEvent);
    });

    it('#onKeyDown should call the currentTool onKeyDown', () => {
        const keyboardEvent = {} as KeyboardEvent;

        service.onKeyDown(keyboardEvent);

        expect(currentToolSpyObj.onKeyDown).toHaveBeenCalledWith(keyboardEvent);
    });

    it('#onKeyUp should call the currentTool onKeyDown', () => {
        const keyboardEvent = {} as KeyboardEvent;

        service.onKeyUp(keyboardEvent);

        expect(currentToolSpyObj.onKeyUp).toHaveBeenCalledWith(keyboardEvent);
    });

    it('#onEnter should set isMouseInsideDrawing from Tool to true, update the mouse position and call the currentTool onEnter', () => {
        const mouseEvent = {} as MouseEvent;
        const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
        getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

        service.onEnter(mouseEvent);

        expect(Tool.isMouseInsideDrawing).toEqual(true);
        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
        expect(currentToolSpyObj.onEnter).toHaveBeenCalledWith(mouseEvent);
    });

    it('#onLeave should set isMouseInsideDrawing from Tool to true, update the mouse position and call the currentTool onLeave', () => {
        Tool.isMouseInsideDrawing = true;
        const mouseEvent = {} as MouseEvent;
        const mousePositionExpectedValue = { x: 0, y: 0 } as Vec2;
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition');
        getMousePositionSpy.and.returnValue(mousePositionExpectedValue);

        service.onLeave(mouseEvent);

        expect(Tool.isMouseInsideDrawing).toEqual(false);
        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(Tool.mousePosition).toEqual(mousePositionExpectedValue);
        expect(currentToolSpyObj.onLeave).toHaveBeenCalledWith(mouseEvent);
    });

    it('#update should update the current tool', () => {
        service.update();
        expect(currentToolSpyObj.update).toHaveBeenCalled();
    });

    it('#get currentTool should return the current tool', () => {
        const toolStub = {} as Tool;
        service['_currentTool'] = toolStub;
        expect(service.currentTool).toEqual(toolStub);
    });

    it(
        '#set currentTool should not call onToolDeselection from Tool if currentTool is undefined, set the current tool and call' +
            ' onToolSelection from Tool',
        () => {
            delete service['_currentTool'];
            service.currentTool = currentToolSpyObj;

            expect(currentToolSpyObj.onToolDeselection).not.toHaveBeenCalled();
            expect(service.currentTool).toEqual(currentToolSpyObj);
            expect(currentToolSpyObj.onToolSelection).toHaveBeenCalled();
        }
    );

    it(
        '#set currentTool should call onToolDeselection from Tool if currentTool is defined, set the current tool and call' +
            ' onToolSelection from Tool',
        () => {
            const initialCurrentToolSpyObj = jasmine.createSpyObj('Tool', ['onToolDeselection']);
            service['_currentTool'] = initialCurrentToolSpyObj;
            service.currentTool = currentToolSpyObj;

            expect(initialCurrentToolSpyObj.onToolDeselection).toHaveBeenCalled();
            expect(service.currentTool).toEqual(currentToolSpyObj);
            expect(currentToolSpyObj.onToolSelection).toHaveBeenCalled();
        }
    );

    it('#getMousePosition should return a Vec2 with x and y values at 0 if the drawing root CTM is null', () => {
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition').and.callThrough();
        drawingRootSpyObj.getScreenCTM.and.returnValue(null);

        const expectedResult = { x: 0, y: 0 } as Vec2;
        const receivedResult = service['getMousePosition']({} as MouseEvent);

        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(drawingRootSpyObj.getScreenCTM).toHaveBeenCalled();
        expect(receivedResult).toEqual(expectedResult);
    });

    it('#getMousePosition should return a Vec2 with adjusted mousePosition values if the drawing root CTM is not null', () => {
        const getMousePositionSpy = spyOn<any>(service, 'getMousePosition').and.callThrough();
        const mouseEvent = { clientX: 100, clientY: 100 } as MouseEvent;
        const createdMatrix = { a: 10, d: 10, e: 10, f: 10 } as DOMMatrix;
        drawingRootSpyObj.getScreenCTM.and.returnValue(createdMatrix);

        const expectedResult = {
            x: (mouseEvent.clientX - createdMatrix.e) / createdMatrix.a,
            y: (mouseEvent.clientY - createdMatrix.f) / createdMatrix.d,
        } as Vec2;
        const receivedResult = service['getMousePosition'](mouseEvent);

        expect(getMousePositionSpy).toHaveBeenCalled();
        expect(drawingRootSpyObj.getScreenCTM).toHaveBeenCalled();
        expect(receivedResult).toEqual(expectedResult);
    });
});
