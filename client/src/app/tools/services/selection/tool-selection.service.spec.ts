import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { ToolSelectionStateService } from '@app/tools/services/selection//tool-selection-state.service';
import { ToolSelectionUiService } from '@app/tools/services/selection//tool-selection-ui.service';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Tool } from '@app/tools/services/tool';
import { Subject } from 'rxjs';

// tslint:disable: max-file-line-count
// tslint:disable: no-empty
// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let toolSelectionUiServiceSpyObj: jasmine.SpyObj<ToolSelectionUiService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;

    let selectAllSubject: Subject<void>;
    let invertObjectsSelectionSpy: any;

    let toolSelectionStateServiceMock: ToolSelectionStateService;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['appendNewMatrixToElements', 'addUiElement', 'removeUiElement'], {
            svgElements: [],
        });

        toolSelectionMoverServiceSpyObj = jasmine.createSpyObj(
            'ToolSelectionMoverService',
            ['moveSelection', 'addMoveCommand', 'onKeyDown', 'onKeyUp'],
            {
                totalSelectionMoveOffset: { x: 0, y: 0 },
            }
        );

        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', [], {
            isMovingSelectionWithMouse: false,
            isMovingSelectionWithArrows: false,
            selectedElements: [],
            selectionRect: { x: 0, y: 0 },
        });

        toolSelectionUiServiceSpyObj = jasmine.createSpyObj(
            'ToolSelectionUiService',
            ['updateSvgSelectedShapesRect', 'updateSvgRectFromRect'],
            {
                svgUserSelectionRect: { x: 0, y: 0 },
            }
        );

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', [
            'getElementsUnderArea',
            'areRectsIntersecting',
        ]);
        toolSelectionCollisionServiceSpyObj.getElementsUnderArea.and.returnValue([]);

        selectAllSubject = new Subject<void>();

        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            selectAllShortcut$: selectAllSubject,
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ToolSelectionMoverService, useValue: toolSelectionMoverServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
                { provide: ToolSelectionUiService, useValue: toolSelectionUiServiceSpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolSelectionService);

        service['isMouseDownInsideDrawing'] = true;
        service['selectionOrigin'] = { x: 0, y: 0 };
        invertObjectsSelectionSpy = spyOn<any>(service, 'invertObjectsSelection').and.callThrough();

        toolSelectionStateServiceMock = ({
            isMovingSelectionWithMouse: false,
            selectedElements: [],
        } as unknown) as ToolSelectionStateService;

        Tool.mousePosition = { x: 69, y: 420 };
        Tool.isMouseInsideDrawing = true;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#ngOnDestroy should unsubscribe selectAllShortcutSubscription', () => {
        service['selectAllShortcutSubscription'] = shortcutServiceSpyObj.selectAllShortcut$.subscribe(() => {});
        const subSpy = spyOn(service['selectAllShortcutSubscription'], 'unsubscribe');
        service.ngOnDestroy();
        expect(subSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should do nothing if no mouse button is down', () => {
        service['currentMouseButtonDown'] = undefined;
        service.onMouseMove();
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).not.toHaveBeenCalled();
    });

    it('#onMouseMove should do nothing if mouse down happened outside drawing area', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        service['isMouseDownInsideDrawing'] = false;
        service.onMouseMove();
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).not.toHaveBeenCalled();
    });

    it('#onMouseMove should move selection if mouse is moving after being clicked inside selection', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        service['toolSelectionStateService'] = ({ isMovingSelectionWithMouse: true } as unknown) as ToolSelectionStateService;
        service.onMouseMove();
        expect(toolSelectionMoverServiceSpyObj.moveSelection).toHaveBeenCalled();
    });

    it('#onMouseMove should update selection under user area if left mouse button is held and selection is not moving', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        toolSelectionCollisionServiceSpyObj.getElementsUnderArea.and.returnValue([]);
        spyOn(Rect, 'fromPoints').and.returnValue({ x: 69, y: 69, width: 420, height: 420 });
        service.onMouseMove();
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionCollisionServiceSpyObj.getElementsUnderArea).toHaveBeenCalled();
        expect(Rect.fromPoints).toHaveBeenCalledWith(service['selectionOrigin'], Tool.mousePosition);
    });

    it('#onMouseMove should invert selection under user area if right mouse button is held', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseMove();
        expect(toolSelectionCollisionServiceSpyObj.getElementsUnderArea).toHaveBeenCalled();
        expect(invertObjectsSelectionSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should invert selection under user area if right mouse button is held', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseMove();
        expect(toolSelectionCollisionServiceSpyObj.getElementsUnderArea).toHaveBeenCalled();
        expect(invertObjectsSelectionSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should do nothing if mouse button held is not left or right', () => {
        service['currentMouseButtonDown'] = MouseButton.Middle;
        service.onMouseMove();
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).not.toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if user is moving selection with arrows', () => {
        service['toolSelectionStateService'] = ({ isMovingSelectionWithArrows: true } as unknown) as ToolSelectionStateService;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.appendNewMatrixToElements).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addUiElement).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).not.toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if a mouse button is alreadyDown', () => {
        service['toolSelectionStateService'] = ({ isMovingSelectionWithArrows: true } as unknown) as ToolSelectionStateService;
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.appendNewMatrixToElements).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.addUiElement).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).not.toHaveBeenCalled();
    });

    it('#onMouseDown should append matrix to element and reset totalSelectionMoveOffset if mouse is inside selection and button is left click', () => {
        service['currentMouseButtonDown'] = undefined;
        spyOn<any>(service, 'isMouseInsideSelection').and.returnValue(true);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.appendNewMatrixToElements).toHaveBeenCalled();
        expect(toolSelectionMoverServiceSpyObj.totalSelectionMoveOffset).toEqual({ x: 0, y: 0 });
    });

    it('#onMouseDown should show user selection if mouse is not inside selection and button is left click', () => {
        service['currentMouseButtonDown'] = undefined;
        spyOn<any>(service, 'isMouseInsideSelection').and.returnValue(false);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.addUiElement).toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.updateSvgRectFromRect).toHaveBeenCalled();
    });

    it('#onMouseDown should reset selection if mouse is not inside drawing', () => {
        service['currentMouseButtonDown'] = undefined;
        Tool.isMouseInsideDrawing = false;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionStateServiceSpyObj.selectedElements).toEqual([]);
    });

    it('#onMouseUp should do nothing if mouse up is not the same as the current mouse button down', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        spyOn<any>(service, 'updateSelectionOnMouseUp');
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service['updateSelectionOnMouseUp']).not.toHaveBeenCalled();
        expect(drawingServiceSpyObj.removeUiElement).not.toHaveBeenCalled();
        expect(toolSelectionMoverServiceSpyObj.addMoveCommand).not.toHaveBeenCalled();
    });

    it('#onMouseUp should remove Ui element if mouse up button is valid', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.removeUiElement).toHaveBeenCalled();
    });

    it('#onMouseUp should update selection on mouse up if user is not moving selection with mouse', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        spyOn<any>(service, 'updateSelectionOnMouseUp');
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service['updateSelectionOnMouseUp']).toHaveBeenCalled();
    });

    it('#onMouseUp should update selection on mouse up if click is single click', () => {
        service['toolSelectionStateService'] = ({ isMovingSelectionWithMouse: true } as unknown) as ToolSelectionStateService;
        service['currentMouseButtonDown'] = MouseButton.Left;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        spyOn<any>(service, 'updateSelectionOnMouseUp');
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service['updateSelectionOnMouseUp']).toHaveBeenCalled();
    });

    // tslint:disable-next-line: max-line-length
    it('#onMouseUp should not call update selection on mouse up if click is not single click and user is moving selection with mouse', () => {
        service['toolSelectionStateService'] = ({ isMovingSelectionWithMouse: true } as unknown) as ToolSelectionStateService;
        service['currentMouseButtonDown'] = MouseButton.Left;
        spyOn<any>(service, 'isSingleClick').and.returnValue(false);
        spyOn<any>(service, 'updateSelectionOnMouseUp');
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(service['updateSelectionOnMouseUp']).not.toHaveBeenCalled();
    });

    it('#onMouseUp should add move command if user has moved selection', () => {
        service['toolSelectionStateService'] = ({ isMovingSelectionWithMouse: true } as unknown) as ToolSelectionStateService;
        service['currentMouseButtonDown'] = MouseButton.Left;
        spyOn<any>(service, 'isSingleClick').and.returnValue(false);
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionMoverServiceSpyObj.addMoveCommand).toHaveBeenCalled();
    });

    it('#onKeyDown should forward event toolSelectionMoverService', () => {
        service.onKeyDown({ key: 'a' } as KeyboardEvent);
        expect(toolSelectionMoverServiceSpyObj.onKeyDown).toHaveBeenCalled();
    });

    it('#onKeyUp should forward event toolSelectionMoverService', () => {
        service.onKeyUp({ key: 'a' } as KeyboardEvent);
        expect(toolSelectionMoverServiceSpyObj.onKeyUp).toHaveBeenCalled();
    });

    it('#onElementClick should do nothing if user is moving selection with arrows', () => {
        const mock = ({ isMovingSelectionWithArrows: true, selectedElements: [] } as unknown) as ToolSelectionStateService;
        service['toolSelectionStateService'] = mock;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, elementToSend);
        expect(mock.selectedElements.length).toEqual(0);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#onElementClick should do nothing if user did not do a single click', () => {
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        spyOn<any>(service, 'isSingleClick').and.returnValue(false);
        service['currentMouseButtonDown'] = MouseButton.Left;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, elementToSend);

        expect(toolSelectionStateServiceMock.selectedElements.length).toEqual(0);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#onElementClick should do nothing button up is not the same as current button down', () => {
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['currentMouseButtonDown'] = MouseButton.Right;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, elementToSend);

        expect(toolSelectionStateServiceMock.selectedElements.length).toEqual(0);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#onElementClick should select element if user left click is valid', () => {
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['currentMouseButtonDown'] = MouseButton.Left;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Left } as MouseEvent, elementToSend);

        expect(toolSelectionStateServiceMock.selectedElements.length).toEqual(1);
    });

    it('#onElementClick should invert element if user right click is valid', () => {
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['currentMouseButtonDown'] = MouseButton.Right;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Right } as MouseEvent, elementToSend);

        expect(invertObjectsSelectionSpy).toHaveBeenCalled();
    });

    it('#onElementClick should do nothing if user middle click is valid', () => {
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['currentMouseButtonDown'] = MouseButton.Middle;
        const elementToSend = {} as SVGGraphicsElement;
        service.onElementClick({ button: MouseButton.Middle } as MouseEvent, elementToSend);

        expect(toolSelectionStateServiceMock.selectedElements.length).toEqual(0);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#update should remove from selection elements no longer in drawing', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;
        const toolSelectionStateMock = ({ selectedElements: [element2, element1] } as unknown) as ToolSelectionStateService;
        const drawingServiceMock = ({ svgElements: [element1] } as unknown) as DrawingService;

        service['toolSelectionStateService'] = toolSelectionStateMock;
        service['drawingService'] = drawingServiceMock;

        service.update();

        expect(toolSelectionStateMock.selectedElements.length).toEqual(1);
        expect(toolSelectionStateMock.selectedElements[0]).toBe(element1);
    });

    it('#update should update selected shapes rect', () => {
        service.update();
        expect(toolSelectionUiServiceSpyObj.setSelectedElementsRectFromElements).toHaveBeenCalled();
    });

    it('#onToolSelection should subscribe from selectAllShortcutSubscription', () => {
        const subSpy = spyOn<any>(shortcutServiceSpyObj.selectAllShortcut$, 'subscribe');
        service.onToolSelection();
        expect(subSpy).toHaveBeenCalled();
    });

    it('#onToolSelection should subscribe to selectAllShortcut with function that selects all element from drawing', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;
        const drawingServiceMock = ({ svgElements: [element1, element2] } as unknown) as DrawingService;
        const toolSelectionStateMock = ({ selectedElements: [] } as unknown) as ToolSelectionStateService;

        service['toolSelectionStateService'] = toolSelectionStateMock;
        service['drawingService'] = drawingServiceMock;

        service.onToolSelection();
        selectAllSubject.next();

        expect(toolSelectionStateMock.selectedElements).toEqual(drawingServiceMock.svgElements);
    });

    it('#onToolDeselection should unsubsrcibe from selectAllShortcutSubscription', () => {
        service['selectAllShortcutSubscription'] = shortcutServiceSpyObj.selectAllShortcut$.subscribe(() => {});
        const subSpy = spyOn(service['selectAllShortcutSubscription'], 'unsubscribe');
        service.onToolDeselection();
        expect(subSpy).toHaveBeenCalled();
    });

    it('#isMouseInsideSelection should return false if selection rect is undefined', () => {
        toolSelectionStateServiceMock = ({ selectionRect: undefined } as unknown) as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const isMouseInsideSelection = service['isMouseInsideSelection']({ x: 1, y: 1 });
        expect(isMouseInsideSelection).toEqual(false);
    });

    it('#isMouseInsideSelection should return true if mouse is inside selection', () => {
        toolSelectionCollisionServiceSpyObj.areRectsIntersecting.and.returnValue(true);
        toolSelectionStateServiceMock = ({ selectionRect: { x: 0, y: 0, width: 420, height: 69 } } as unknown) as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const isMouseInsideSelection = service['isMouseInsideSelection']({ x: 1, y: 1 });
        expect(isMouseInsideSelection).toEqual(true);
    });

    it('#isMouseInsideSelection should return false if mouse is not inside selection', () => {
        toolSelectionCollisionServiceSpyObj.areRectsIntersecting.and.returnValue(false);
        toolSelectionStateServiceMock = ({
            selectionRect: { x: 10, y: 10, width: 420, height: 69 },
        } as unknown) as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const isMouseInsideSelection = service['isMouseInsideSelection']({ x: 1, y: 1 });
        expect(isMouseInsideSelection).toEqual(false);
    });

    it('#isSingleClick should return if user has moved mouse', () => {
        Tool.mousePosition = { x: 0, y: 0 };
        expect(service['isSingleClick']()).toEqual(true);

        Tool.mousePosition = { x: 1, y: 0 };
        expect(service['isSingleClick']()).toEqual(false);
    });

    it('#updateSelectionOnMouseUp should do nothing if mouse is not inside drawing or if mouse was not down inside drawing', () => {
        Tool.isMouseInsideDrawing = false;
        service['currentMouseButtonDown'] = MouseButton.Left;
        service['updateSelectionOnMouseUp']({ button: MouseButton.Left } as MouseEvent);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#updateSelectionOnMouseUp should invert selection right button is up', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service['updateSelectionOnMouseUp']({ button: MouseButton.Right } as MouseEvent);
        spyOn<any>(service, 'isSingleClick').and.returnValue(false);
        expect(invertObjectsSelectionSpy).toHaveBeenCalled();
    });

    it('#updateSelectionOnMouseUp should do nothing if middle mouse button is up', () => {
        service['currentMouseButtonDown'] = MouseButton.Middle;
        service['updateSelectionOnMouseUp']({ button: MouseButton.Middle } as MouseEvent);
        spyOn<any>(service, 'isSingleClick').and.returnValue(false);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#updateSelectionOnMouseUp should reset elements if isSingleClick !hasUserJustClickedOnShape and mouse button is left', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        service['hasUserJustClickedOnShape'] = false;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['updateSelectionOnMouseUp']({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionStateServiceSpyObj.selectedElements.length).toEqual(0);
    });

    it('#updateSelectionOnMouseUp do nothin  if isSingleClick !hasUserJustClickedOnShape and mouse button is right', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service['hasUserJustClickedOnShape'] = false;
        spyOn<any>(service, 'isSingleClick').and.returnValue(true);
        service['updateSelectionOnMouseUp']({ button: MouseButton.Right } as MouseEvent);
        expect(invertObjectsSelectionSpy).not.toHaveBeenCalled();
    });

    it('#invertObjectsSelection should invert the state of the elements sent', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;

        const svgElementsToInverse = [element1, element2];
        const selection = [element2];

        service['invertObjectsSelection'](svgElementsToInverse, selection);

        expect(selection).toEqual([element1]);
    });
});
