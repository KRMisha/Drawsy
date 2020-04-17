import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorService } from '@app/drawing/services/color.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { Vec2 } from '@app/shared/classes/vec2';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionUiService } from '@app/tools/services/selection//tool-selection-ui.service';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionRotatorService } from '@app/tools/services/selection/tool-selection-rotator.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Tool } from '@app/tools/services/tool';
import { Subject } from 'rxjs';

// tslint:disable: max-file-line-count
// tslint:disable: no-any
// tslint:disable: no-empty
// tslint:disable: no-string-literal

describe('ToolSelectionService', () => {
    let service: ToolSelectionService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionUiServiceSpyObj: jasmine.SpyObj<ToolSelectionUiService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;
    let toolSelectionRotatorServiceSpyObj: jasmine.SpyObj<ToolSelectionRotatorService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    let selectAllSubject: Subject<void>;

    let selectionStateServiceStub: ToolSelectionStateService;

    let selectedElementsChangedSubject: Subject<SVGGraphicsElement[]>;

    beforeEach(() => {
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue({} as Renderer2);

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['findDrawingChildElement', 'removeElement'], {
            elements: [],
        });

        toolSelectionMoverServiceSpyObj = jasmine.createSpyObj('ToolSelectionMoverService', [
            'moveSelection',
            'startMovingSelection',
            'stopMovingSelection',
            'onKeyDown',
            'onKeyUp',
            'onToolDeselection',
            'reset',
        ]);

        toolSelectionRotatorServiceSpyObj = jasmine.createSpyObj('ToolSelectionRotatorService', ['onScroll']);

        toolSelectionUiServiceSpyObj = jasmine.createSpyObj(
            'ToolSelectionUiService',
            [
                'updateUserSelectionRectCursor',
                'setUserSelectionRect',
                'showUserSelectionRect',
                'hideUserSelectionRect',
                'resetUserSelectionRectCursor',
                'reset',
            ],
            {
                svgUserSelectionRect: { x: 0, y: 0 },
            }
        );

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', [
            'getElementsUnderArea',
            'areRectsIntersecting',
            'getElementListBounds',
            'isPointInRect',
        ]);
        toolSelectionCollisionServiceSpyObj.getElementsUnderArea.and.returnValue([]);

        selectAllSubject = new Subject<void>();

        shortcutServiceSpyObj = jasmine.createSpyObj('ShortcutService', [], {
            selectAllShortcut$: selectAllSubject,
        });

        selectedElementsChangedSubject = new Subject<SVGGraphicsElement[]>();
        selectionStateServiceStub = ({
            state: SelectionState.None,
            selectedElements: [],
            selectedElementsChanged$: selectedElementsChangedSubject,
        } as unknown) as ToolSelectionStateService;

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ColorService, useValue: {} as ColorService },
                { provide: HistoryService, useValue: historyServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: selectionStateServiceStub },
                { provide: ToolSelectionMoverService, useValue: toolSelectionMoverServiceSpyObj },
                { provide: ToolSelectionRotatorService, useValue: toolSelectionRotatorServiceSpyObj },
                { provide: ToolSelectionUiService, useValue: toolSelectionUiServiceSpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: ShortcutService, useValue: shortcutServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolSelectionService);

        service['selectionOrigin'] = { x: 0, y: 0 };

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

    it('#onMouseMove should do nothing if the selection state is None', () => {
        selectionStateServiceStub.state = SelectionState.None;
        service.onMouseMove({} as MouseEvent);
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.setUserSelectionRect).not.toHaveBeenCalled();
    });

    it('#onMouseMove should do nothing if the selection state is MovingSelectionWithArrows', () => {
        selectionStateServiceStub.state = SelectionState.MovingSelectionWithArrows;
        service.onMouseMove({} as MouseEvent);
        expect(toolSelectionMoverServiceSpyObj.moveSelection).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.setUserSelectionRect).not.toHaveBeenCalled();
    });

    it('#onMouseMove should change its state to MovingSelectionWithMouse in mouse move if its state was SelectionMoveStartClick', () => {
        selectionStateServiceStub.state = SelectionState.SelectionMoveStartClick;
        const mousePosition: Vec2 = { x: 420, y: 69 };
        Tool.mousePosition = mousePosition;
        service['previousMousePosition'] = mousePosition;
        service.onMouseMove({} as MouseEvent);
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.MovingSelectionWithMouse.toString());
        expect(toolSelectionMoverServiceSpyObj.moveSelection).toHaveBeenCalledWith(expectedPosition);
    });

    it('#onMouseMove should change its state to ChangingSelection in mouse move if its state was SelectionChangeStartClick', () => {
        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service.onMouseMove({} as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.ChangingSelection.toString());
    });

    it('#onMouseMove should change selected elements to elements under user selection rect if user is ChangingSelection with left mouse button', () => {
        selectionStateServiceStub.state = SelectionState.ChangingSelection;
        service['currentMouseButtonDown'] = MouseButton.Left;
        const elemsUnderAreaMock = [{} as SVGGraphicsElement];
        toolSelectionCollisionServiceSpyObj.getElementsUnderArea.and.returnValue(elemsUnderAreaMock);
        service.onMouseMove({} as MouseEvent);
        expect(selectionStateServiceStub.selectedElements).toBe(elemsUnderAreaMock);
    });

    it('#onMouseMove invert selection under user selection rect if user is ChangingSelection with right mouse button', () => {
        selectionStateServiceStub.state = SelectionState.ChangingSelection;
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseMove({} as MouseEvent);
        expect(toolSelectionCollisionServiceSpyObj.getElementsUnderArea).toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if invalid mouse button', () => {
        service.onMouseDown({ button: MouseButton.Middle } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.updateUserSelectionRectCursor).not.toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if a button is already pressed', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.updateUserSelectionRectCursor).not.toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing and set state to none if mouse is outside drawing', () => {
        Tool.isMouseInsideDrawing = false;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.updateUserSelectionRectCursor).not.toHaveBeenCalled();
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.None.toString());
    });

    it('#onMouseDown should change state to SelectionMoveStartClick if click is inside selection and left mouse button is down', () => {
        Tool.isMouseInsideDrawing = true;
        spyOn<any>(service, 'isMouseInsideSelectedElementBounds').and.returnValue(true);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.SelectionMoveStartClick.toString());
    });

    it('#onMouseDown should change state to SelectionChangeStartClick if click is outside selection and left mouse button is down', () => {
        Tool.isMouseInsideDrawing = true;
        spyOn<any>(service, 'isMouseInsideSelectedElementBounds').and.returnValue(false);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.SelectionChangeStartClick.toString());
    });

    it('#onMouseUp should do nothing if mouse up is not the same as the current mouse button down', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.hideUserSelectionRect).not.toHaveBeenCalled();
    });

    it('#onMouseUp should remove Ui element if mouse up button is valid', () => {
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.hideUserSelectionRect).toHaveBeenCalled();
    });

    it('#onMouseUp should invert selected elements if user was changing selection and right mouse button is up', () => {
        selectionStateServiceStub.state = SelectionState.ChangingSelection;
        service['selectedElementsAfterInversion'] = [];
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(selectionStateServiceStub.selectedElements).toBe(service['selectedElementsAfterInversion']);
    });

    it('#onMouseUp should not invert selected elements if user was changing selection and left mouse button is up', () => {
        selectionStateServiceStub.state = SelectionState.ChangingSelection;
        service['selectedElementsAfterInversion'] = [];
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(selectionStateServiceStub.selectedElements).not.toBe(service['selectedElementsAfterInversion']);
    });

    it('#onMouseUp add move command if user was moving selection', () => {
        selectionStateServiceStub.state = SelectionState.MovingSelectionWithMouse;
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionMoverServiceSpyObj.stopMovingSelection).toHaveBeenCalled();
    });

    it('#onMouseUp should do nothing if user is moving selection with arrwos', () => {
        selectionStateServiceStub.state = SelectionState.MovingSelectionWithArrows;
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(toolSelectionUiServiceSpyObj.updateUserSelectionRectCursor).not.toHaveBeenCalled();
    });

    it('#onMouseUp should select element under mouse if click did not move', () => {
        const elementStub = {} as SVGGraphicsElement;
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(elementStub);
        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);

        expect(selectionStateServiceStub.selectedElements).toEqual([elementStub]);
    });

    it('#onMouseUp should remove selection if left click on nothing', () => {
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(undefined);
        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service['currentMouseButtonDown'] = MouseButton.Left;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);

        expect(selectionStateServiceStub.selectedElements).toEqual([]);
    });

    it('#onMouseUp should invert selection of click element if right click', () => {
        const elementStub = {} as SVGGraphicsElement;
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(elementStub);
        selectionStateServiceStub.selectedElements = [];

        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);

        expect(selectionStateServiceStub.selectedElements).toEqual([elementStub]);
    });

    it('#onMouseUp should invert selection of click element if right click', () => {
        const elementStub = {} as SVGGraphicsElement;
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(elementStub);
        selectionStateServiceStub.selectedElements = [elementStub];

        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);

        expect(selectionStateServiceStub.selectedElements).toEqual([]);
    });

    it('#onMouseUp should do nothing if right click has no elements under it', () => {
        const elementStub = {} as SVGGraphicsElement;
        drawingServiceSpyObj.findDrawingChildElement.and.returnValue(undefined);
        selectionStateServiceStub.selectedElements = [elementStub];

        selectionStateServiceStub.state = SelectionState.SelectionChangeStartClick;
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Right } as MouseEvent);

        expect(selectionStateServiceStub.selectedElements).toEqual([elementStub]);
    });

    it('#onScroll should forward event to toolSelectionRoratorService', () => {
        const eventStub = {} as WheelEvent;
        service.onScroll(eventStub);
        expect(toolSelectionRotatorServiceSpyObj.onScroll).toHaveBeenCalledWith(eventStub);
    });

    it("#onKeyDown should call #deleteSelection whe  the key is 'Backspace'", () => {
        const deleteSelectionSpy = spyOn(service, 'deleteSelection');
        service.onKeyDown({ key: 'Backspace' } as KeyboardEvent);
        expect(deleteSelectionSpy).toHaveBeenCalled();
    });

    it("#onKeyDown should call #deleteSelection whe  the key is 'Delete'", () => {
        const deleteSelectionSpy = spyOn(service, 'deleteSelection');
        service.onKeyDown({ key: 'Delete' } as KeyboardEvent);
        expect(deleteSelectionSpy).toHaveBeenCalled();
    });

    it("#onKeyDown should call #reset whe  the key is 'Escape'", () => {
        const resetSpy = spyOn<any>(service, 'reset');
        service.onKeyDown({ key: 'Escape' } as KeyboardEvent);
        expect(resetSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should call forward the event to toolSelectionMover if switch defaults', () => {
        const keyboardEventStub = { key: 'peni' } as KeyboardEvent;
        service.onKeyDown(keyboardEventStub);
        expect(toolSelectionMoverServiceSpyObj.onKeyDown).toHaveBeenCalledWith(keyboardEventStub);
    });

    it('#onKeyUp should forward event toolSelectionMoverService', () => {
        service.onKeyUp({ key: 'a' } as KeyboardEvent);
        expect(toolSelectionMoverServiceSpyObj.onKeyUp).toHaveBeenCalled();
    });

    it('#onFocusOut should call #reset', () => {
        const resetSpy = spyOn<any>(service, 'reset');
        service.onFocusOut();
        expect(resetSpy).toHaveBeenCalled();
    });

    it('#onHystoryChange should remove from selection elements no longer in drawing', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;
        const drawingServiceMock = ({ elements: [element1] } as unknown) as DrawingService;
        selectionStateServiceStub.selectedElements = [element2, element1];

        service['drawingService'] = drawingServiceMock;

        service.onHistoryChange();

        expect(selectionStateServiceStub.selectedElements.length).toEqual(1);
        expect(selectionStateServiceStub.selectedElements[0]).toBe(element1);
    });

    it('#onDrawingLoad should reset the selectedElements of toolSelectionStateService and call #reset', () => {
        const resetSpy = spyOn<any>(service, 'reset');
        service.onDrawingLoad();
        expect(service['toolSelectionStateService'].selectedElements.length).toEqual(0);
        expect(resetSpy).toHaveBeenCalled();
    });

    it('#deleteSelection should return early if tehre are no selectedElements in the ToolSelectionStateServe', () => {
        selectionStateServiceStub.selectedElements = [];
        service.deleteSelection();
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#deleteSelection should add a command with the ElementSiblingPairs of the deleted elements', () => {
        const elementWithoutSibling = {} as SVGGraphicsElement;
        const elementWithSibling = ({ nextSibling: {} as SVGGraphicsElement } as unknown) as SVGGraphicsElement;
        const initialSelectedElements = [elementWithSibling, elementWithoutSibling, elementWithSibling];
        const drawingServiceMock = ({
            removeElement(): void {},
            elements: initialSelectedElements,
        } as unknown) as DrawingService;
        const removeElementSpy = spyOn<any>(drawingServiceMock, 'removeElement');
        service['drawingService'] = drawingServiceMock;
        selectionStateServiceStub.selectedElements = initialSelectedElements;
        service.deleteSelection();
        expect(removeElementSpy).toHaveBeenCalledWith(elementWithSibling);
        expect(removeElementSpy).toHaveBeenCalledWith(elementWithoutSibling);
        expect(removeElementSpy).toHaveBeenCalledWith(elementWithSibling);
        expect(service['toolSelectionStateService'].selectedElements.length).toEqual(0);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalled();
    });

    it('#onToolSelection should subscribe from selectAllShortcutSubscription', () => {
        const subSpy = spyOn<any>(shortcutServiceSpyObj.selectAllShortcut$, 'subscribe');
        service.onToolSelection();
        expect(subSpy).toHaveBeenCalled();
    });

    it('#onToolSelection should subscribe to selectAllShortcut with function that selects all element from drawing', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;
        const drawingServiceMock = ({ elements: [element1, element2] } as unknown) as DrawingService;

        selectionStateServiceStub.selectedElements = [];

        service['drawingService'] = drawingServiceMock;

        service.onToolSelection();
        selectAllSubject.next();

        expect(selectionStateServiceStub.selectedElements).toEqual(drawingServiceMock.elements);
    });

    it('#onToolDeselection should unsubscribe from selectAllShortcutSubscription', () => {
        service.onToolSelection();
        const selectAllShortcutSubscriptionSpy = spyOn<any>(service['selectAllShortcutSubscription'], 'unsubscribe');
        const resetSpy = spyOn<any>(service, 'reset');
        service.onToolDeselection();
        expect(selectAllShortcutSubscriptionSpy).toHaveBeenCalled();
        expect(resetSpy).toHaveBeenCalled();
    });

    it('#isMouseInsideSelectedElementBounds should return false if selection rect is undefined', () => {
        const toolSelectionStateServiceMock = ({ selectionRect: undefined } as unknown) as ToolSelectionStateService;
        selectionStateServiceStub = toolSelectionStateServiceMock;
        const isMouseInsideSelectedElementBounds = service['isMouseInsideSelectedElementBounds']();
        expect(isMouseInsideSelectedElementBounds).toEqual(false);
    });

    it('#isMouseInsideSelectedElementBounds should return value of isPointInRect if selection rect is not undefined', () => {
        selectionStateServiceStub.selectedElementsBounds = {} as Rect;
        service['isMouseInsideSelectedElementBounds']();
        expect(toolSelectionCollisionServiceSpyObj.isPointInRect).toHaveBeenCalled();
    });

    it('#reset should call reset on the Mover and Ui selection service and change the selectionState to None and delete the currentMouseButton status', () => {
        service['currentMouseButtonDown'] = MouseButton.Back;
        service['reset']();
        expect(service['currentMouseButtonDown']).toBeUndefined();
        expect(toolSelectionMoverServiceSpyObj.reset).toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.reset).toHaveBeenCalled();
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.None.toString());
    });
});
