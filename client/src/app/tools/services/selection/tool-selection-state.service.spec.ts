import { TestBed } from '@angular/core/testing';
import { Rect } from '@app/shared/classes/rect';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal

describe('ToolSelectionStateService', () => {
    let toolSelectionCollisionServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let service: ToolSelectionStateService;

    const elementListBounds = { x: 69, y: 420, width: 666, height: 69420 };

    beforeEach(() => {
        toolSelectionCollisionServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);
        toolSelectionCollisionServiceSpyObj.getElementListBounds.and.returnValue(elementListBounds);

        TestBed.configureTestingModule({
            providers: [{ provide: ToolSelectionCollisionService, useValue: toolSelectionCollisionServiceSpyObj }],
        });

        service = TestBed.inject(ToolSelectionStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#get selectedElements should return the selected elements', () => {
        const expectedValue = [] as SVGGraphicsElement[];
        service['_selectedElements'] = expectedValue;
        const actualValue = service.selectedElements;
        expect(actualValue).toBe(expectedValue);
    });

    it('#set selectedElements should update the selection rect and the selected elements', () => {
        const expectedValue = [] as SVGGraphicsElement[];
        service.selectedElements = expectedValue;
        expect(service['_selectedElements']).toBe(expectedValue);
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalledWith(expectedValue);
    });

    it('#set selectedElements should notify its subcribers that its value has changed', () => {
        const selectedElementsRectChangedSourceSpy = spyOn<any>(service['selectedElementsRectChangedSource'], 'next');
        service.selectedElements = [];
        expect(selectedElementsRectChangedSourceSpy).toHaveBeenCalledWith(elementListBounds);
    });

    it("#get selectedElementsRect should return the selected elements' bounding rectangle", () => {
        const expectedValue = {} as Rect;
        service['_selectedElementsRect'] = expectedValue;
        const actualValue = service.selectedElementsBounds;
        expect(actualValue).toBe(expectedValue);
    });

    it('#set selectedElementsRect should update the selected elements bounding rect', () => {
        const expectedValue = {} as Rect;
        service.selectedElementsBounds = expectedValue;
        expect(service['_selectedElementsRect']).toBe(expectedValue);
    });

    it('#set selectedElementsRect should notify its subcribers that its value has changed', () => {
        const selectedElementsRectChangedSourceSpy = spyOn<any>(service['selectedElementsRectChangedSource'], 'next');
        const rectStub = {} as Rect;
        service.selectedElementsBounds = rectStub;
        expect(selectedElementsRectChangedSourceSpy).toHaveBeenCalledWith(rectStub);
    });
});
