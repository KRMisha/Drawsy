import { TestBed } from '@angular/core/testing';
import { HistoryService } from '@app/drawing/services/history.service';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';
import { ToolSelectionTransformService } from './tool-selection-transform.service';

// tslint:disable: no-any
// tslint:disable: no-empty
// tslint:disable: no-string-literal

fdescribe('ToolSelectionMoverService', () => {
    // const moveOffset = 3;
    let service: ToolSelectionMoverService;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let toolSelectionTransformServiceSpyObj: jasmine.SpyObj<ToolSelectionTransformService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;

    let setArrowStateFromEventSpy: any;

    const initialSelectedElements = [{} as SVGGraphicsElement];

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

        setArrowStateFromEventSpy = spyOn<any>(service, 'setArrowStateFromEvent');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should early return if the key is not an arrow key', () => {
        service.onKeyDown({ key: 'K' } as KeyboardEvent);
        expect(setArrowStateFromEventSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should set arrow state', () => {
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

        // tslint:disable-next-line: typedef
        const event = { key: 'ArrowUp', preventDefault() {} } as KeyboardEvent;
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        service.onKeyDown(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should set arrow state and, if the arrow buttons are released, call #stopMovingSelection', () => {
        const stopMovingSelectionSpy = spyOn(service, 'stopMovingSelection');
        const toolSelectionStateServiceMock = { state: SelectionState.MovingSelectionWithArrows } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(setArrowStateFromEventSpy).toHaveBeenCalledWith(event, false);
        expect(stopMovingSelectionSpy).toHaveBeenCalled();
    });

    it('#onKeyUp should return early if the selection is not being moved with arrows', () => {
        const toolSelectionStateServiceMock = { state: SelectionState.None } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const event = {} as KeyboardEvent;
        service.onKeyUp(event);
        expect(setArrowStateFromEventSpy).not.toHaveBeenCalled();
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
        const moveElementSpy = spyOn(service, 'moveElement');
        const moveOffset = { x: 2, y: 2 };
        service.moveSelection(moveOffset);
        expect(moveElementSpy).toHaveBeenCalledWith(initialSelectedElements[0], moveOffset);
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalledWith(
            toolSelectionStateServiceSpyObj.selectedElements
        );
    });

    // it('#setArrowStateFromEvent should set the correct state depeding on the event', () => {
    //     service['setArrowStateFromEvent']({ key: 'ArrowUp' } as KeyboardEvent, true);
    //     expect(service['isArrowUpHeld']).toEqual(true);

    //     service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, true);
    //     expect(service['isArrowDownHeld']).toEqual(true);

    //     service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, true);
    //     expect(service['isArrowLeftHeld']).toEqual(true);

    //     service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, true);
    //     expect(service['isArrowRightHeld']).toEqual(true);

    //     service['setArrowStateFromEvent']({ key: 'ArrowUp' } as KeyboardEvent, false);
    //     expect(service['isArrowUpHeld']).toEqual(false);

    //     service['setArrowStateFromEvent']({ key: 'ArrowDown' } as KeyboardEvent, false);
    //     expect(service['isArrowDownHeld']).toEqual(false);

    //     service['setArrowStateFromEvent']({ key: 'ArrowLeft' } as KeyboardEvent, false);
    //     expect(service['isArrowLeftHeld']).toEqual(false);

    //     service['setArrowStateFromEvent']({ key: 'ArrowRight' } as KeyboardEvent, false);
    //     expect(service['isArrowRightHeld']).toEqual(false);
    // });

    // it('#moveElementList should tranlate matrix of elements sent', () => {
    //     const matrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['translate']);
    //     const svgTransformListSpyObj = jasmine.createSpyObj('SVGTransformList', ['setMatrix'], {
    //         matrix: matrixSpyObj,
    //     });
    //     const baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem']);
    //     baseValSpyObj.getItem.and.returnValue(svgTransformListSpyObj);
    //     const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', [], {
    //         transform: { baseVal: baseValSpyObj },
    //     });
    //     service['moveElementList']([elementSpyObj], { x: 69, y: 420 });
    //     expect(matrixSpyObj.translate).toHaveBeenCalled();
    // });

    // it('#moveSelectionInArrowDirection should not move horizontaly if right and left key are held', () => {
    //     service['isArrowLeftHeld'] = true;
    //     service['isArrowRightHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].x).toEqual(0);
    // });

    // it('#moveSelectionInArrowDirection should not move vertically if up and down key are held', () => {
    //     service['isArrowUpHeld'] = true;
    //     service['isArrowDownHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].y).toEqual(0);
    // });

    // it('#moveSelectionInArrowDirection should move horizontaly if left key is held', () => {
    //     service['isArrowLeftHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].x).toEqual(-moveOffset);
    // });

    // it('#moveSelectionInArrowDirection should move vertically if up key is held', () => {
    //     service['isArrowUpHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].y).toEqual(-moveOffset);
    // });

    // it('#moveSelectionInArrowDirection should move horizontaly if right key is held', () => {
    //     service['isArrowRightHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].x).toEqual(moveOffset);
    // });

    // it('#moveSelectionInArrowDirection should move vertically if up down is held', () => {
    //     service['isArrowDownHeld'] = true;
    //     service['moveSelectionInArrowDirection']();
    //     expect(service['totalSelectionMoveOffset'].y).toEqual(moveOffset);
    // });
});
