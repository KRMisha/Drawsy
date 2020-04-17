import { async, TestBed } from '@angular/core/testing';
import { ClipboardService } from '@app/drawing/services/clipboard.service';
import { DrawingService } from '@app/drawing/services/drawing.service';
import { HistoryService } from '@app/drawing/services/history.service';
import { Vec2 } from '@app/shared/classes/vec2';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionMoverService } from '@app/tools/services/selection/tool-selection-mover.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionTransformService } from '@app/tools/services/selection/tool-selection-transform.service';
import { ToolSelectionService } from '@app/tools/services/selection/tool-selection.service';
import { Subject } from 'rxjs';

// tslint:disable: no-any
// tslint:disable: no-string-literal

// enum PlacementType {
//     Clipboard,
//     Duplication,
// }

fdescribe('ClipboardService', () => {
    let service: ClipboardService;
    let drawingServiceSpyObj: jasmine.SpyObj<DrawingService>;
    let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
    let toolSelectionServiceSpyObj: jasmine.SpyObj<ToolSelectionService>;
    let toolSelectionStateServiceSpyObj: jasmine.SpyObj<ToolSelectionStateService>;
    let toolSelectionMoverServiceSpyObj: jasmine.SpyObj<ToolSelectionMoverService>;
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let toolSelectionTransformServiceSpyObj: jasmine.SpyObj<ToolSelectionTransformService>;
    let drawingHistoryChangedSubject: Subject<void>;
    let selectedElementsChangedSubject: Subject<SVGGraphicsElement[]>;

    // const placementPositionOffsetIncrement = 25;
    beforeEach(() => {
        drawingHistoryChangedSubject = new Subject<void>();
        selectedElementsChangedSubject = new Subject<SVGGraphicsElement[]>();

        drawingServiceSpyObj = jasmine.createSpyObj('DrawingService', ['addElement'], {
            elements: {} as SVGGraphicsElement[],
            dimensions: {} as Vec2,
        });

        historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['addCommand'], {
            drawingHistoryChanged$: drawingHistoryChangedSubject,
        });

        toolSelectionServiceSpyObj = jasmine.createSpyObj('ToolSelectionService', ['deleteSelection']);
        toolSelectionStateServiceSpyObj = jasmine.createSpyObj('ToolSelectionStateService', ['deleteSelection'], {
            selectedElements: {},
            selectedElementsChanged$: selectedElementsChangedSubject,
            state: {},
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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#constructor should subscribe to toolSelectionStateService's selectedElementsChanged and historyService's drawingHistoryChanged",
        async(() => {
        // const elementsStub = {} as SVGGraphicsElement[];
        // const onSelectionChangeSpy = spyOn<any>(service, 'onSelectionChange');
        // const ononDrawingHistoryChangeSpy = spyOn<any>(service, 'onDrawingHistoryChange');
        // selectedElementsChangedSubject.next(elementsStub);
        // drawingHistoryChangedSubject.next();
        // expect(onSelectionChangeSpy).toHaveBeenCalled();
        // expect(ononDrawingHistoryChangeSpy).toHaveBeenCalled();
    }));

    it('#ngOnDestroy should unsubscribe from selectionChangedSubscription and drawingHistoryChangedSubscription', async(() => {
        const selectionChangedSubscriptionSpy = spyOn<any>(service['selectionChangedSubscription'], 'unsubscribe');
        const drawingHistoryChangedSubscriptionSpy = spyOn<any>(service['drawingHistoryChangedSubscription'], 'unsubscribe');

        service.ngOnDestroy();

        expect(selectionChangedSubscriptionSpy).toHaveBeenCalled();
        expect(drawingHistoryChangedSubscriptionSpy).toHaveBeenCalled();
    }));
});
