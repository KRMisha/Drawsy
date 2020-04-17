import { TestBed } from '@angular/core/testing';
import { TransformElementsCommand } from '@app/drawing/classes/commands/transform-elements-command';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Rect } from '@app/shared/classes/rect';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionRotatorService } from '@app/tools/services/selection/tool-selection-rotator.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';
import { ToolSelectionMoverService } from './tool-selection-mover.service';
import { ToolSelectionStateService } from './tool-selection-state.service';
import { ToolSelectionTransformService } from './tool-selection-transform.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty

describe('ToolSelectionRotatorService', () => {
    let drawingRootSpyObj: jasmine.SpyObj<SVGSVGElement>;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let toolSelectionTransformServiceSpyObj: jasmine.SpyObj<ToolSelectionTransformService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let service: ToolSelectionRotatorService;

    const initialElement = {} as SVGGraphicsElement;
    const initialElementsList = [initialElement];
    const initialBound = { x: 0, y: 0, width: 2, height: 2 } as Rect;
    beforeEach(() => {
        drawingRootSpyObj = jasmine.createSpyObj('SVGSVGElement', ['getScreenCTM', 'createSVGPoint']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', [], { drawingRoot: drawingRootSpyObj });
        toolSelectionMoverServiceSpyObj = jasmine.createSpyObj('ToolSelectionMoverService', ['moveSelection']);
        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionServiceSpyObj', [
            'getElementListBounds',
            'getElementBounds',
        ]);
        toolSelectionTransformServiceSpyObj = jasmine.createSpyObj('ToolSelectionTransformService', [
            'getElementListTransformsCopy',
            'initializeElementTransforms',
        ]);
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', [''], {
            state: SelectionState.None,
            selectedElements: initialElementsList,
            selectedElementsBound: initialBound,
        });
        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: ToolSelectionMoverService, useValue: toolSelectionMoverServiceSpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: ToolSelectionTransformService, useValue: toolSelectionTransformServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
            ],
        }).compileComponents();
        service = TestBed.inject(ToolSelectionRotatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onScroll should return early if the control key is pressed', () => {
        const event = { ctrlKey: true } as WheelEvent;
        service.onScroll(event);
        expect(toolSelectionTransformServiceSpyObj.getElementListTransformsCopy).not.toHaveBeenCalled();
    });

    it('#onScroll should return early if the selection state is None and there are no elements selected', () => {
        const toolSelectionStateServiceMock = ({
            state: SelectionState.None,
            selectedElements: [],
        } as unknown) as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const event = { ctrlKey: false } as WheelEvent;
        service.onScroll(event);
        expect(toolSelectionTransformServiceSpyObj.getElementListTransformsCopy).not.toHaveBeenCalled();
    });

    it("#onScroll should return early if the mouse didn't scroll", () => {
        const event = { ctrlKey: false, deltaY: 0 } as WheelEvent;
        service.onScroll(event);
        expect(toolSelectionTransformServiceSpyObj.getElementListTransformsCopy).not.toHaveBeenCalled();
    });

    it('#onScroll should prevent the default behavior, copy the elements transforms before the rotation and initialize new tranforms on the selected elements', () => {
        const event = { ctrlKey: false, deltaY: 2, preventDefault(): void {} } as WheelEvent;
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        service.onScroll(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(toolSelectionTransformServiceSpyObj.getElementListTransformsCopy).toHaveBeenCalledWith(initialElementsList);
        expect(toolSelectionTransformServiceSpyObj.initializeElementTransforms).toHaveBeenCalledWith(initialElementsList);
    });

    it('#onScroll should get the rotation angle, apply an individual rotation to the selected elements and add a new command if the shift key is pressed', () => {
        const expectedTransformsBefore = [[]] as SVGTransform[][];
        const expectedTransformsAfter = [[]] as SVGTransform[][];
        const expectedAngle = 25;
        const getAngleSpy = spyOn<any>(service, 'getAngle').and.returnValue(expectedAngle);
        const rotateSelectedElementsIndividuallySpy = spyOn<any>(service, 'rotateSelectedElementsIndividually');
        let initialCall = false;
        toolSelectionTransformServiceSpyObj.getElementListTransformsCopy.and.callFake((elements: SVGGraphicsElement[]) => {
            switch (initialCall) {
                case true:
                    initialCall = false;
                    return expectedTransformsBefore;
                case false:
                    return expectedTransformsAfter;
            }
        });

        const event = { ctrlKey: false, deltaY: 2, shiftKey: true, altKey: false, preventDefault(): void {} } as WheelEvent;
        service.onScroll(event);
        expect(getAngleSpy).toHaveBeenCalledWith(event.deltaY, event.altKey);
        expect(rotateSelectedElementsIndividuallySpy).toHaveBeenCalledWith(expectedAngle);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new TransformElementsCommand(initialElementsList, expectedTransformsBefore, expectedTransformsAfter)
        );
    });

    it('#onScroll should get the rotation angle, apply a rotation around the center to the selected elements and add a new command if the shift key is not pressed', () => {
        const expectedTransformsBefore = [[]] as SVGTransform[][];
        const expectedTransformsAfter = [[]] as SVGTransform[][];
        const expectedAngle = 25;
        const getAngleSpy = spyOn<any>(service, 'getAngle').and.returnValue(expectedAngle);
        const rotateSelectionAroundCenterSpy = spyOn<any>(service, 'rotateSelectionAroundCenter');
        let initialCall = false;
        toolSelectionTransformServiceSpyObj.getElementListTransformsCopy.and.callFake((elements: SVGGraphicsElement[]) => {
            switch (initialCall) {
                case true:
                    initialCall = false;
                    return expectedTransformsBefore;
                case false:
                    return expectedTransformsAfter;
            }
        });

        const event = { ctrlKey: false, deltaY: 2, shiftKey: false, altKey: false, preventDefault(): void {} } as WheelEvent;
        service.onScroll(event);
        expect(getAngleSpy).toHaveBeenCalledWith(event.deltaY, event.altKey);
        expect(rotateSelectionAroundCenterSpy).toHaveBeenCalledWith(expectedAngle);
        expect(historyServiceSpyObj.addCommand).toHaveBeenCalledWith(
            new TransformElementsCommand(initialElementsList, expectedTransformsBefore, expectedTransformsAfter)
        );
    });

    it("#getAngle should return a positive 1 degree angle if the mouse wheel's delta is positive and the alt key is pressed", () => {
        const returnValue = service['getAngle'](2, true);
        expect(returnValue).toEqual(1);
    });

    it("#getAngle should return a negative 15 degree angle if the mouse wheel's delta is negative and the alt key is not pressed", () => {
        const returnValue = service['getAngle'](-1, false);
        expect(returnValue).toEqual(-15); // tslint:disable-line: no-magic-numbers
    });

    it('#rotateSelectionAroundCenter should early return if the selectedElements boundary is undefined', () => {
        const toolSelectionStateServiceMock = { selectedElementsBounds: undefined } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const rotateElementAroundPointSpy = spyOn<any>(service, 'rotateElementAroundPoint');
        service['rotateSelectionAroundCenter'](1);
        expect(rotateElementAroundPointSpy).not.toHaveBeenCalled();
    });

    it('#rotateSelectionAroundCenter should call #rotateElementAroundPoint for each selectedElements and then call #moveSelection', () => {
        const rotateElementAroundPointSpy = spyOn<any>(service, 'rotateElementAroundPoint');
        const toolSelectionStateServiceMock = {
            selectedElementsBounds: initialBound,
            selectedElements: [initialElement, initialElement],
        } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;
        const elementBoundsAfter = { x: 0, y: 0, width: 4, height: 4 } as Rect;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(elementBoundsAfter);
        service['rotateSelectionAroundCenter'](2);
        expect(rotateElementAroundPointSpy).toHaveBeenCalledTimes(toolSelectionStateServiceMock.selectedElements.length);
        expect(rotateElementAroundPointSpy).toHaveBeenCalledWith(
            initialElement,
            { x: initialBound.x + initialBound.width / 2, y: initialBound.y + initialBound.height / 2 },
            2
        );
        const movementToCorrect = {
            x: initialBound.x + initialBound.width / 2 - (elementBoundsAfter.x + elementBoundsAfter.width / 2),
            y: initialBound.y + initialBound.height / 2 - (elementBoundsAfter.x + elementBoundsAfter.height / 2),
        };
        expect(toolSelectionMoverServiceSpyObj.moveSelection).toHaveBeenCalledWith(movementToCorrect);
    });

    it("#rotateSelectedElementsIndividually should call #rotateElementAroundPoint for each selectedElements and set the selected elements' boundary", () => {
        const toolSelectionStateServiceMock = {
            selectedElementsBounds: initialBound,
            selectedElements: [initialElement, initialElement],
        } as ToolSelectionStateService;
        service['toolSelectionStateService'] = toolSelectionStateServiceMock;

        const rotateElementAroundPointSpy = spyOn<any>(service, 'rotateElementAroundPoint');
        const elementBounds = { x: 0, y: 0, width: 2, height: 2 } as Rect;
        toolSelectionCollisionServiceSpyObj.getElementBounds.and.returnValue(elementBounds);
        drawingRootSpyObj.createSVGPoint.and.returnValue({ x: 0, y: 0 } as DOMPoint);

        const expectedBounds = {} as Rect;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(expectedBounds);

        service['rotateSelectedElementsIndividually'](2);
        const rotationPoint = { x: elementBounds.x + elementBounds.width / 2, y: elementBounds.y + elementBounds.height / 2 };
        expect(rotateElementAroundPointSpy).toHaveBeenCalledWith(initialElement, rotationPoint, 2);
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalledWith(
            toolSelectionStateServiceMock.selectedElements
        );
        expect(toolSelectionStateServiceMock.selectedElementsBounds).toEqual(expectedBounds);
    });

    it("#rotateElementAroundPoint should return early if the drawing root's screenCTM is null", () => {
        drawingRootSpyObj.getScreenCTM.and.returnValue(null);
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getScreenCTM']);
        elementSpyObj.getScreenCTM.and.returnValue({} as DOMMatrix);
        service['rotateElementAroundPoint'](elementSpyObj, { x: 0, y: 0 }, 2);
        expect(drawingRootSpyObj.createSVGPoint).not.toHaveBeenCalled();
    });

    it("#rotateElementAroundPoint should return early if the element's screenCTM is null", () => {
        drawingRootSpyObj.getScreenCTM.and.returnValue({} as DOMMatrix);
        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getScreenCTM']);
        elementSpyObj.getScreenCTM.and.returnValue(null);
        service['rotateElementAroundPoint'](elementSpyObj, { x: 0, y: 0 }, 2);
        expect(drawingRootSpyObj.createSVGPoint).not.toHaveBeenCalled();
    });

    it('#rotateElementAroundPoint ', () => {
        const screenCTMSpyObj = jasmine.createSpyObj('DOMMatrix', ['inverse']);
        const invertedCTMSpyObj = jasmine.createSpyObj('DOMMatrix', ['multiply']);
        const multipliedCTMSpyObj = jasmine.createSpyObj('DOMMatrix', ['inverse']);
        invertedCTMSpyObj.multiply.and.returnValue(multipliedCTMSpyObj);
        screenCTMSpyObj.inverse.and.returnValue(invertedCTMSpyObj);
        multipliedCTMSpyObj.inverse.and.returnValue(invertedCTMSpyObj);
        drawingRootSpyObj.getScreenCTM.and.returnValue(screenCTMSpyObj);

        const centerOfRotationSpyObj = jasmine.createSpyObj('DOMPoint', [], { x: 0, y: 0 });
        const rotationPointSpyObj = jasmine.createSpyObj('DOMPoint', ['matrixTransform'], { x: 0, y: 0 });
        rotationPointSpyObj.matrixTransform.and.returnValue(centerOfRotationSpyObj);
        drawingRootSpyObj.createSVGPoint.and.returnValue(rotationPointSpyObj);

        const rotatedMatrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['translate']);
        const translatedMatrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['rotate']);
        rotatedMatrixSpyObj.translate.and.returnValue(translatedMatrixSpyObj);
        translatedMatrixSpyObj.rotate.and.returnValue(rotatedMatrixSpyObj);
        const matrixSpyObj = jasmine.createSpyObj('DOMMatrix', ['translate']);
        matrixSpyObj.translate.and.returnValue(translatedMatrixSpyObj);
        const transformSpyObj = jasmine.createSpyObj('SVGTransform', ['setMatrix'], { matrix: matrixSpyObj });
        const baseValSpyObj = jasmine.createSpyObj('SVGTransformList', ['getItem']);
        baseValSpyObj.getItem.and.returnValue(transformSpyObj);
        const transformListSpyObj = jasmine.createSpyObj('SVGAnimatedTransformList', [], { baseVal: baseValSpyObj });

        const elementSpyObj = jasmine.createSpyObj('SVGGraphicsElement', ['getScreenCTM'], { transform: transformListSpyObj });
        elementSpyObj.getScreenCTM.and.returnValue(screenCTMSpyObj);

        service['rotateElementAroundPoint'](elementSpyObj, { x: 0, y: 0 }, 2);
        expect(drawingRootSpyObj.createSVGPoint).toHaveBeenCalled();
        expect(rotationPointSpyObj.matrixTransform).toHaveBeenCalledWith(invertedCTMSpyObj);
        expect(transformSpyObj.setMatrix).toHaveBeenCalledWith(translatedMatrixSpyObj);
    });
});
