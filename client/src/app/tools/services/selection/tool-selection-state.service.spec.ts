import { async, TestBed } from '@angular/core/testing';
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

    it("should call toolSelectionCollisionService's getElementListBounds when selectedElementsChanged observable is emited", async(() => {
        const svgGraphicsElementStub = {} as SVGGraphicsElement;
        const svgGraphicsElementsArray = [svgGraphicsElementStub, svgGraphicsElementStub, svgGraphicsElementStub];
        service.selectedElementsChanged$.next(svgGraphicsElementsArray);
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalledWith(svgGraphicsElementsArray);
    }));

    it('#ngOnDestroy should unsubscribe from selectedElements changes', () => {
        const selectedElementsChangedSubscriptionSpy = spyOn<any>(service['selectedElementsChangedSubscription'], 'unsubscribe');
        service.ngOnDestroy();
        expect(selectedElementsChangedSubscriptionSpy).toHaveBeenCalled();
    });

    it('#get selectedElements should return the selected elements', () => {
        const expectedValue = [] as SVGGraphicsElement[];
        service['_selectedElements'] = expectedValue;
        const actualValue = service.selectedElements;
        expect(actualValue).toBe(expectedValue);
    });

    it('#set selectedElements should update the selectedElements and emit selectedElementsChanged', () => {
        const selectedElementsChanged$Spy = spyOn<any>(service['selectedElementsChanged$'], 'next');
        const expectedValue = [] as SVGGraphicsElement[];
        service.selectedElements = expectedValue;
        expect(service['_selectedElements']).toBe(expectedValue);
        expect(selectedElementsChanged$Spy).toHaveBeenCalledWith(expectedValue);
    });

    it("#get selectedElementsBounds should return the selected elements' bounding rectangle", () => {
        const expectedValue = {} as Rect;
        service['_selectedElementsBounds'] = expectedValue;
        const actualValue = service.selectedElementsBounds;
        expect(actualValue).toBe(expectedValue);
    });

    it('#set selectedElementsRect should update the selected elements bounding rect', () => {
        const selectedElementsBoundsChangedSourceSpy = spyOn<any>(service['selectedElementsBoundsChangedSource'], 'next');
        const expectedValue = {} as Rect;
        service.selectedElementsBounds = expectedValue;
        expect(service['_selectedElementsBounds']).toBe(expectedValue);
        expect(selectedElementsBoundsChangedSourceSpy).toHaveBeenCalledWith(expectedValue);
    });
});
