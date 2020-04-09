import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { Rect } from '@app/shared/classes/rect';
import { MouseButton } from '@app/shared/enums/mouse-button.enum';
import { ShortcutService } from '@app/shared/services/shortcut.service';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionUiService } from '@app/tools/services/selection//tool-selection-ui.service';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
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
    let renderer2SpyObj: jasmine.SpyObj<Renderer2>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionUiServiceSpyObj: jasmine.SpyObj<ToolSelectionUiService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let shortcutServiceSpyObj: jasmine.SpyObj<ShortcutService>;

    let selectAllSubject: Subject<void>;

    let selectionStateServiceStub: ToolSelectionStateService;

    beforeEach(() => {
        renderer2SpyObj = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement']);
        const rendererFactory2SpyObj = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        rendererFactory2SpyObj.createRenderer.and.returnValue(renderer2SpyObj);

        drawingServiceSpyObj = jasmine.createSpyObj(
            'DrawingService',
            ['appendNewMatrixToElements', 'addUiElement', 'removeUiElement', 'findDrawingChildElement'],
            {
                svgElements: [],
            }
        );

        toolSelectionMoverServiceSpyObj = jasmine.createSpyObj(
            'ToolSelectionMoverService',
            ['moveSelectedElements', 'startMovingSelection', 'stopMovingSelection', 'onKeyDown', 'onKeyUp', 'onToolDeselection'],
            {
                totalSelectionMoveOffset: { x: 0, y: 0 },
            }
        );

        toolSelectionUiServiceSpyObj = jasmine.createSpyObj(
            'ToolSelectionUiService',
            [
                'updateUserSelectionRectCursor',
                'setUserSelectionRect',
                'showUserSelectionRect',
                'hideUserSelectionRect',
                'resetUserSelectionRectCursor',
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

        selectionStateServiceStub = ({
            state: SelectionState.None,
            selectedElements: [],
        } as unknown) as ToolSelectionStateService;

        TestBed.configureTestingModule({
            providers: [
                { provide: RendererFactory2, useValue: rendererFactory2SpyObj },
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ToolSelectionMoverService, useValue: toolSelectionMoverServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: selectionStateServiceStub },
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
        expect(toolSelectionMoverServiceSpyObj.moveSelectedElements).not.toHaveBeenCalled();
        expect(toolSelectionUiServiceSpyObj.setUserSelectionRect).not.toHaveBeenCalled();
    });

    it('#onMouseMove should change its state to MovingSelectionWithMouse in mouse move if its state was SelectionMoveStartClick', () => {
        selectionStateServiceStub.state = SelectionState.SelectionMoveStartClick;
        service.onMouseMove({} as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.MovingSelectionWithMouse.toString());
        expect(toolSelectionMoverServiceSpyObj.moveSelectedElements).toHaveBeenCalled();
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
        spyOn<any>(service, 'isMouseInsideSelectedElementsRect').and.returnValue(true);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.SelectionMoveStartClick.toString());
    });

    it('#onMouseDown should change state to SelectionChangeStartClick if click is outside selection and left mouse button is down', () => {
        Tool.isMouseInsideDrawing = true;
        spyOn<any>(service, 'isMouseInsideSelectedElementsRect').and.returnValue(false);
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(selectionStateServiceStub.state.toString()).toEqual(SelectionState.SelectionChangeStartClick.toString());
    });

    it('#onMouseUp should do nothing if mouse up is not the same as the current mouse button down', () => {
        service['currentMouseButtonDown'] = MouseButton.Right;
        service.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(drawingServiceSpyObj.removeUiElement).not.toHaveBeenCalled();
        expect(toolSelectionMoverServiceSpyObj.stopMovingSelection).not.toHaveBeenCalled();
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

    it('#onKeyDown should forward event toolSelectionMoverService', () => {
        service.onKeyDown({ key: 'a' } as KeyboardEvent);
        expect(toolSelectionMoverServiceSpyObj.onKeyDown).toHaveBeenCalled();
    });

    it('#onKeyUp should forward event toolSelectionMoverService', () => {
        service.onKeyUp({ key: 'a' } as KeyboardEvent);
        expect(toolSelectionMoverServiceSpyObj.onKeyUp).toHaveBeenCalled();
    });

    it('#update should remove from selection elements no longer in drawing', () => {
        const element1 = {} as SVGGraphicsElement;
        const element2 = {} as SVGGraphicsElement;
        const drawingServiceMock = ({ svgElements: [element1] } as unknown) as DrawingService;
        selectionStateServiceStub.selectedElements = [element2, element1];

        service['drawingService'] = drawingServiceMock;

        service.update();

        expect(selectionStateServiceStub.selectedElements.length).toEqual(1);
        expect(selectionStateServiceStub.selectedElements[0]).toBe(element1);
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

        selectionStateServiceStub.selectedElements = [];

        service['drawingService'] = drawingServiceMock;

        service.onToolSelection();
        selectAllSubject.next();

        expect(selectionStateServiceStub.selectedElements).toEqual(drawingServiceMock.svgElements);
    });

    it('#onToolDeselection should unsubsrcibe from selectAllShortcutSubscription', () => {
        service['selectAllShortcutSubscription'] = shortcutServiceSpyObj.selectAllShortcut$.subscribe(() => {});
        const subSpy = spyOn(service['selectAllShortcutSubscription'], 'unsubscribe');
        service.onToolDeselection();
        expect(subSpy).toHaveBeenCalled();
    });

    it('#isMouseInsideSelectedElementsRect should return false if selection rect is undefined', () => {
        const toolSelectionStateServiceMock = ({ selectionRect: undefined } as unknown) as ToolSelectionStateService;
        selectionStateServiceStub = toolSelectionStateServiceMock;
        const isMouseInsideSelectedElementsRect = service['isMouseInsideSelectedElementsRect']();
        expect(isMouseInsideSelectedElementsRect).toEqual(false);
    });

    it('#isMouseInsideSelectedElementsRect should return value of isPointInRect if selection rect is not undefined', () => {
        selectionStateServiceStub.selectedElementsRect = {} as Rect;
        service['isMouseInsideSelectedElementsRect']();
        expect(toolSelectionCollisionServiceSpyObj.isPointInRect).toHaveBeenCalled();
    });
});
