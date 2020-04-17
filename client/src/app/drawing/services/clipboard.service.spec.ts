import { async, TestBed } from '@angular/core/testing';
import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { SelectionState } from '@app/tools/enums/selection-state.enum';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

enum PlacementType {
    Clipboard,
    Duplication,
}

describe('ClipboardService', () => {
    let service: ClipboardService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let toolSelectionServiceSpyObj: jasmine.SpyObj<ToolSelectionService>;
    let elementStub: jasmine.SpyObj<SVGGraphicsElement>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let toolSelectionTransformServiceSpyObj: jasmine.SpyObj<ToolSelectionTransformService>;
    let drawingHistoryChangedSubject: Subject<void>;
    let selectedElementsChangedSubject: Subject<SVGGraphicsElement[]>;

    let isSelectionAvailableSpy: any;

    // const placementPositionOffsetIncrement = 25;
    beforeEach(() => {
        drawingHistoryChangedSubject = new Subject<void>();
        selectedElementsChangedSubject = new Subject<SVGGraphicsElement[]>();

        elementStub = jasmine.createSpyObj('SVGGraphicsElement', ['cloneNode']);
        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement'], {
            elements: [elementStub] as SVGGraphicsElement[],
            dimensions: { x: 10000, y: 10000 } as Vec2,
        });

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand'], {
            drawingHistoryChanged$: drawingHistoryChangedSubject,
        });

        toolSelectionServiceSpyObj = jasmine.createSpyObj('ToolSelectionService', ['deleteSelection']);

        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['deleteSelection'], {
            selectedElements: [elementStub],
            selectedElementsChanged$: selectedElementsChangedSubject,
            state: SelectionState.None,
        });

        toolSelectionMoverServiceSpyObj = jasmine.createSpyObj('ToolSelectionMoverService', ['moveSelection']);

        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);

        toolSelectionTransformServiceSpyObj = jasmine.createSpyObj('ToolSelectionTransformService', ['initializeElementTransforms']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpyObj },
                { provide: HistoryService, useValue: historyServiceSpyObj },
                { provide: ToolSelectionService, useValue: toolSelectionServiceSpyObj },
                { provide: ToolSelectionStateService, useValue: toolSelectionStateServiceSpyObj },
                { provide: ToolSelectionMoverService, useValue: toolSelectionMoverServiceSpyObj },
                { provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj },
                { provide: ToolSelectionTransformService, useValue: toolSelectionTransformServiceSpyObj },
            ],
        });

        service = TestBed.inject(ClipboardService);

        isSelectionAvailableSpy = spyOn<any>(service, 'isSelectionAvailable').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // tslint:disable-next-line: max-line-length
    it("#constructor should subscribe to toolSelectionStateService's selectedElementsChanged and historyService's drawingHistoryChanged", () => {
        service['duplicationPositionOffset'] = 1;
        drawingHistoryChangedSubject.next();
        expect(service['duplicationPositionOffset']).toEqual(0);
    });

    // tslint:disable-next-line: max-line-length
    it("#constructor should subscribe to toolSelectionStateService's selectedElementsChanged and historyService's drawingHistoryChanged", () => {
        const elementsStub = [] as SVGGraphicsElement[];
        service['duplicationPositionOffset'] = 1;
        selectedElementsChangedSubject.next(elementsStub);
        expect(service['duplicationPositionOffset']).toEqual(0);
    });

    it('#ngOnDestroy should unsubscribe from selectionChangedSubscription and drawingHistoryChangedSubscription', async(() => {
        const selectionChangedSubscriptionSpy = spyOn<any>(service['selectionChangedSubscription'], 'unsubscribe');
        const drawingHistoryChangedSubscriptionSpy = spyOn<any>(service['drawingHistoryChangedSubscription'], 'unsubscribe');

        service.ngOnDestroy();

        expect(selectionChangedSubscriptionSpy).toHaveBeenCalled();
        expect(drawingHistoryChangedSubscriptionSpy).toHaveBeenCalled();
    }));

    it('#copy should do nothing if selection is not available', () => {
        service['clipboardBuffer'] = [];
        service['initialClipboardElements'] = [];
        service['initialDuplicationElements'] = [];
        isSelectionAvailableSpy.and.returnValue(false);
        service.copy();
        expect(service['clipboardBuffer']).toEqual([]);
        expect(service['initialClipboardElements']).toEqual([]);
        expect(service['initialDuplicationElements']).toEqual([]);
    });

    it('#copy should deep copy selection if selection is available', () => {
        service['clipboardBuffer'] = [];
        service['initialClipboardElements'] = [];
        service['initialDuplicationElements'] = [];
        isSelectionAvailableSpy.and.returnValue(true);
        service.copy();
        expect(service['initialClipboardElements']).toEqual([elementStub]);
        expect(service['initialDuplicationElements']).toBe(service['initialClipboardElements']);
        expect(elementStub.cloneNode).toHaveBeenCalled();
    });

    it('#paste should do nothing if pasting is not available', () => {
        spyOn<any>(service, 'isPastingAvailable').and.returnValue(false);
        service.paste();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#paste should place elements if pasting is not available', () => {
        service['clipboardBuffer'] = [elementStub];
        service['initialClipboardElements'] = [elementStub];
        spyOn<any>(service, 'isPastingAvailable').and.returnValue(true);
        service.paste();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it('#paste should change clipboard initial elements if not in drawing anymore elements if pasting is not available', () => {
        service['clipboardBuffer'] = [elementStub];
        service['initialClipboardElements'] = [{} as SVGGraphicsElement];
        spyOn<any>(service, 'isPastingAvailable').and.returnValue(true);
        spyOn<any>(service, 'getElementsCopy').and.returnValue([elementStub]);
        service.paste();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
        expect(service['initialClipboardElements']).toEqual([elementStub]);
    });

    it('#cut should do nothing if selection is not available', () => {
        isSelectionAvailableSpy.and.returnValue(false);
        const copySpy = spyOn(service, 'copy');
        service.cut();
        expect(copySpy).not.toHaveBeenCalled();
        expect(toolSelectionServiceSpyObj.deleteSelection).not.toHaveBeenCalled();
    });

    it('#cut should copy and delete if selection is available', () => {
        isSelectionAvailableSpy.and.returnValue(true);
        const copySpy = spyOn(service, 'copy');
        service.cut();
        expect(copySpy).toHaveBeenCalled();
        expect(toolSelectionServiceSpyObj.deleteSelection).toHaveBeenCalled();
    });

    it('#duplicate should not place elements if selection is not available', () => {
        isSelectionAvailableSpy.and.returnValue(false);
        service['initialDuplicationElements'] = [elementStub];
        service.duplicate();
        expect(drawingServiceSpyObj.addElement).not.toHaveBeenCalled();
    });

    it('#duplicate should  place elements if selection is available', () => {
        isSelectionAvailableSpy.and.returnValue(true);
        service['initialDuplicationElements'] = [elementStub];
        service.duplicate();
        expect(drawingServiceSpyObj.addElement).toHaveBeenCalled();
    });

    it('#isSelectionAvailable should return true if there are selected elements and selection state is none', () => {
        expect(service.isSelectionAvailable()).toEqual(true);
    });

    it('#isSelectionAvailable should return false if there are selected elements and selection state is not none', () => {
        service['toolSelectionStateService'] = {
            state: SelectionState.ChangingSelection,
            selectedElements: [{}],
        } as ToolSelectionStateService;
        expect(service.isSelectionAvailable()).toEqual(false);
    });

    it('#isPastingAvailable should return true if there are pasted elements and selection state is none', () => {
        service['clipboardBuffer'] = [{} as SVGGraphicsElement];
        expect(service.isPastingAvailable()).toEqual(true);
    });

    it('#isPastingAvailable should return false if there are elements and selection state is not none', () => {
        service['clipboardBuffer'] = [{} as SVGGraphicsElement];
        service['toolSelectionStateService'] = { state: SelectionState.ChangingSelection } as ToolSelectionStateService;
        expect(service.isPastingAvailable()).toEqual(false);
    });

    it('#offsetSelectedElements should move selection if offset is not zero', () => {
        const offset = 25;
        spyOn<any>(service, 'getNextOffset').and.returnValue(offset);
        service['offsetSelectedElements'](false, PlacementType.Clipboard);
        expect(toolSelectionMoverServiceSpyObj.moveSelection).toHaveBeenCalledWith({ x: offset, y: offset });
    });

    it('#getNextOffset should return xdd', () => {
        const offset = 25;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue({ x: 69, y: 420, width: 911, height: 666 });
        expect(service['getNextOffset']([] as SVGGraphicsElement[], 0)).toEqual(offset);
    });

    it('#getNextOffset should return an incremented offset if next placement is not out of bounds', () => {
        const offset = 25;
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue({ x: 69, y: 420, width: 911, height: 666 });
        expect(service['getNextOffset']([] as SVGGraphicsElement[], 0)).toEqual(offset);
    });

    it('#getNextOffset should return 0 if next placement is not out of bounds', () => {
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue({ x: 10000, y: 10000, width: 911, height: 666 });
        expect(service['getNextOffset']([] as SVGGraphicsElement[], 0)).toEqual(0);
    });
});
