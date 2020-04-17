import { async, TestBed } from '@angular/core/testing';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { ArrowKey } from '@app/shared/enums/arrow-key.enum';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';
import { ToolSelectionTransformService } from './tool-selection-transform.service';

// tslint:disable: no-any
// tslint:disable: no-empty
// tslint:disable: no-string-literal
// tslint:disable: max-line-length

describe('ToolSelectionMoverService', () => {
    let service: ToolSelectionMoverService;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let toolSelectionTransformServiceSpyObj: jasmine.SpyObj<ToolSelectionTransformService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    const initialElement = {} as SVGGraphicsElement;
    const initialSelectedElements = [initialElement, initialElement];

    const moveOffset = 3;
    beforeEach(() => {
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['updateSelectionRect'], {
            isMovingSelectionWithMouse: false,
            isMovingSelectionWithArrows: false,
            selectedElements: initialSelectedElements,
            selectionRect: { x: 0, y: 0 },
        });

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);

        toolSelectionTransformServiceSpyObj = jasmine.createSpyObj('ToolSelectionTransformService', [
            'getElementListTransformsCopy',
            'initializeElementTransforms',
        ]);

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: ToolSelectionTransformService, useValue: toolSelectionTransformServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        });

        service = TestBed.inject(ToolSelectionMoverService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should early return if the key is not an arrow key', () => {
        const setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent');
        service.onKeyDown({ key: 'K' } as KeyboardEvent);
        expect(setArrowStateFromEventSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should set arrow state', () => {
        const setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent');
        service.onKeyDown({ key: 'ArrowUp' } as KeyboardEvent);
        expect(setArrowStateFromEventSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should call #startMovingSelectionWithArrows if the selection state is None and there is an arrow key held', () => {
        const toolSelectionStateServiceMock = { state: SelectionState.None } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        service['arrowKeysHeldStates'] = [true, false, false, false];

        const startMovingSelectionWithArrowsSpy = spyOn<any>(service, 'startMovingSelectionWithArrows');
        service.onKeyDown({ key: 'ArrowUp' } as KeyboardEvent);
        expect(startMovingSelectionWithArrowsSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should prevent default behaviour of the keyboard keys while the user is moving the selection with the arrows', () => {
        const toolSelectionStateServiceMock = { state: SelectionState.MovingSelectionWithArrows } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;

        const event = { key: 'ArrowUp', preventDefault(): void {} } as KeyboardEvent;
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        service.onKeyDown(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should set arrow state and, if the arrow buttons are released, call #stopMovingSelection', () => {
        const setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent');
        const stopMovingSelectionSpy = spyOn(service, 'stopMovingSelection');
        const toolSelectionStateServiceMock = { state: SelectionState.MovingSelectionWithArrows } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(setArrowStateFromEventSpy).toHaveBeenCalledWith(event, false);
        expect(stopMovingSelectionSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should return early after setting arrow state if the selection is not being moved with arrows', () => {
        const setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent');
        const everySpy = spyOn<any>(service['arrowKeysHeldStates'], 'every');
        const toolSelectionStateServiceMock = { state: SelectionState.None } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(setArrowStateFromEventSpy).toHaveBeenCalled();
        expect(everySpy).not.toHaveBeenCalled();
    });

    it('#onKeyUp should not stop moving the selection if the arrow buttons are held', () => {
        const stopMovingSelectionSpy = spyOn(service, 'stopMovingSelection');
        const toolSelectionStateServiceMock = { state: SelectionState.MovingSelectionWithArrows } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        service['arrowKeysHeldStates'] = [true, false, false, false];
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(stopMovingSelectionSpy).not.toHaveBeenCalled();
    });

    it('#startMovingSelection should set selectedElementTransformsBeforeMove and initialize the transforms of the selected elements', () => {
        const svgTransformArrayMock = [[]] as SVGTransform[][];
        toolSelectionTransformServiceSpyObj.getElementListTransformsCopy.and.returnValue(svgTransformArrayMock);
        service.startMovingSelection();
        expect(service['selectedElementTransformsBeforeMove']).toBe(svgTransformArrayMock);
        expect(toolSelectionTransformServiceSpyObj.initializeElementTransforms).toHaveBeenCalledWith(
            toolSelectionStateServiceSpyObj.selectedElements
        );
    });

    it('#moveSelection should move each element of the selection and update the selected elements bounding rect', () => {
        const moveElementSpy = spyOn<any>(service, 'moveElement');
        const expectedMoveOffset = { x: 2, y: 2 };
        service.moveSelection(expectedMoveOffset);
        expect(moveElementSpy).toHaveBeenCalledWith(initialSelectedElements[0], expectedMoveOffset);
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalledWith(
            toolSelectionStateServiceSpyObj.selectedElements
        );
    });

    it('#stopMovingSelection should return early if the selection is not being moved', () => {
        const toolSelectionStateServiceMock = { state: SelectionState.None } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        service.stopMovingSelection();
        expect(historyServiceSpyObj.addCommand).not.toHaveBeenCalled();
    });

    it('#stopMovingSelection should add a new transform element command to the historyService and set the selection state to None', () => {
        const toolSelectionStateServiceMock = {
            state: SelectionState.MovingSelectionWithMouse,
            selectedElements: initialSelectedElements,
        } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;

        const selectedElementsTransformsBeforeMoveMock = [[]] as SVGTransform[][];
        service['selectedElementTransformsBeforeMove'] = selectedElementsTransformsBeforeMoveMock;
        const expectedTranformsCopy = [[]] as SVGTransform[][];
        toolSelectionTransformServiceSpyObj.getElementListTransformsCopy.and.returnValue(expectedTranformsCopy);
        service.stopMovingSelection();
        expect(toolSelectionTransformServiceSpyObj.getElementListTransformsCopy).toHaveBeenCalledWith(initialSelectedElements);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new TransformElementsCommand(initialSelectedElements, selectedElementsTransformsBeforeMoveMock, expectedTranformsCopy)
        );
        expect(toolSelectionStateServiceMock.state).toEqual(SelectionState.None);
    });

    it("#stopMovingSelection should call window's clearTimeout and clearInterval when the selection was moved with the arrow keys", () => {
        const toolSelectionStateServiceMock = {
            state: SelectionState.MovingSelectionWithArrows,
            selectedElements: initialSelectedElements,
        } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;

        const clearTimeoutSpy = spyOn(window, 'clearTimeout');
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        service.stopMovingSelection();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('#reset should call #stopMovingSelection and set the arrow keys held state to false', () => {
        const stopMovingSelectionSpy = spyOn(service, 'stopMovingSelection');
        service.reset();
        expect(service['arrowKeysHeldStates']).toEqual([false, false, false, false]);
        expect(stopMovingSelectionSpy).toHaveBeenCalled();
    });

    it('#setArrowStateFromEvent should set the correct state depeding on the event', () => {
        service['arrowKeysHeldStates'] = [false, false, false, false];

        const event = { key: 'ArrowUp' } as KeyboardEvent;
        service['setArrowStateFromEvent'](event, true);
        expect(service['arrowKeysHeldStates'][ArrowKey.Up]).toEqual(true);

        service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, true);
        expect(service['arrowKeysHeldStates'][ArrowKey.Down]).toEqual(true);

        service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, true);
        expect(service['arrowKeysHeldStates'][ArrowKey.Left]).toEqual(true);

        service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, true);
        expect(service['arrowKeysHeldStates'][ArrowKey.Right]).toEqual(true);

        service['setArrowStateFromEvent']({ key: 'ArrowUp' } as KeyboardEvent, false);
        expect(service['arrowKeysHeldStates'][ArrowKey.Up]).toEqual(false);

        service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, false);
        expect(service['arrowKeysHeldStates'][ArrowKey.Down]).toEqual(false);

        service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, false);
        expect(service['arrowKeysHeldStates'][ArrowKey.Left]).toEqual(false);

        service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, false);
        expect(service['arrowKeysHeldStates'][ArrowKey.Right]).toEqual(false);
    });

    it("#moveElement should apply a translation to the element's transform matrix", () => {
        const expectedMatrix = {} as DOMMatrix;
        const matrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['translate']);
        matrixSpyObj.translate.and.returnValue(expectedMatrix);
        const transformSpyObj = jasmine.createSpyObj('SVGTransform', ['setMatrix'], { matrix: matrixSpyObj });
        const svgTransformListSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem']);
        svgTransformListSpyObj.getItem.and.returnValue(transformSpyObj);
        const animatedTransformListMock = { baseVal: svgTransformListSpyObj } as SVGAnimatedTransformList;
        const elementMock = { transform: animatedTransformListMock } as SVGGraphicsElement;

        const offset = { x: 2, y: 2 } as Vec2;
        service['moveElement'](elementMock, offset);

        expect(matrixSpyObj.translate).toHaveBeenCalledWith(offset.x, offset.y);
        expect(transformSpyObj.setMatrix).toHaveBeenCalledWith(expectedMatrix);
    });

    it('#startMovingSelectionWithArrows should set the selection state to MovingSelectionWithArrows and call #startMovingSelection and #moveSelectionWithArrows', async(() => {
        const toolSelectionStateServiceMock = {
            state: SelectionState.None,
            selectedElements: initialSelectedElements,
        } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const startMovingSelectionSpy = spyOn<any>(service, 'startMovingSelection');
        const moveSelectionWithArrowsSpy = spyOn<any>(service, 'moveSelectionWithArrows').and.stub();
        service['startMovingSelectionWithArrows']();
        expect(toolSelectionStateServiceMock.state).toEqual(SelectionState.MovingSelectionWithArrows);
        expect(startMovingSelectionSpy).toHaveBeenCalled();
        expect(moveSelectionWithArrowsSpy).toHaveBeenCalled();

        window.clearTimeout(service['movingTimeoutId']);
        window.clearInterval(service['movingIntervalId']);
    }));

    it('#startMovingSelectionWithArrows should call moveSelectionWithArrows after 500 ms', async(() => {
        jasmine.clock().install();

        const moveSelectionWithArrowsSpy = spyOn<any>(service, 'moveSelectionWithArrows').and.stub();
        const timeoutDuration = 500;
        const intervalDuration = 100;
        service['startMovingSelectionWithArrows']();
        let callcount = 1;
        jasmine.clock().tick(timeoutDuration);
        expect(moveSelectionWithArrowsSpy).toHaveBeenCalledTimes(callcount++);
        jasmine.clock().tick(intervalDuration);
        expect(moveSelectionWithArrowsSpy).toHaveBeenCalledTimes(callcount++);

        window.clearTimeout(service['movingTimeoutId']);
        window.clearInterval(service['movingIntervalId']);

        jasmine.clock().uninstall();
    }));

    it('#moveSelectionInArrowDirection should not move horizontaly if right and left keys are held and should not move vertically if the up and down keys are held', () => {
        const moveSelectionSpy = spyOn(service, 'moveSelection');
        service['arrowKeysHeldStates'][ArrowKey.Left] = true;
        service['arrowKeysHeldStates'][ArrowKey.Right] = true;
        service['moveSelectionWithArrows']();
        expect(moveSelectionSpy).toHaveBeenCalledWith({ x: 0, y: 0 });
    });

    it('#moveSelectionInArrowDirection should move horizontaly if left key is held', () => {
        const moveSelectionSpy = spyOn(service, 'moveSelection');
        service['arrowKeysHeldStates'][ArrowKey.Left] = true;
        service['moveSelectionWithArrows']();
        expect(moveSelectionSpy).toHaveBeenCalledWith({ x: -moveOffset, y: 0 });
    });

    it('#moveSelectionInArrowDirection should move vertically if up key is held', () => {
        const moveSelectionSpy = spyOn(service, 'moveSelection');
        service['arrowKeysHeldStates'][ArrowKey.Up] = true;
        service['moveSelectionWithArrows']();
        expect(moveSelectionSpy).toHaveBeenCalledWith({ x: 0, y: -moveOffset });
    });

    it('#moveSelectionInArrowDirection should move horizontaly if right key is held', () => {
        const moveSelectionSpy = spyOn(service, 'moveSelection');
        service['arrowKeysHeldStates'][ArrowKey.Right] = true;
        service['moveSelectionWithArrows']();
        expect(moveSelectionSpy).toHaveBeenCalledWith({ x: moveOffset, y: 0 });
    });

    it('#moveSelectionInArrowDirection should move vertically if up down is held', () => {
        const moveSelectionSpy = spyOn(service, 'moveSelection');
        service['arrowKeysHeldStates'][ArrowKey.Down] = true;
        service['moveSelectionWithArrows']();
        expect(moveSelectionSpy).toHaveBeenCalledWith({ x: 0, y: moveOffset });
    });
});
