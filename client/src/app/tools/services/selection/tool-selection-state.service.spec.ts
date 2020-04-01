import { TestBed } from '@angular/core/testing';
import { SvgUtilityService } from '@app/drawing/services/svg-utility.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

// tslint:disable: no-any

describe('ToolSelectionStateService', () => {
    let svgUtilityServiceSpyObj: jasmine.SpyObj<SvgUtilityService>;
    let service: ToolSelectionStateService;

    const elementListBounds = { x: 69, y: 420, width: 666, height: 69420 };

    beforeEach(() => {
        svgUtilityServiceSpyObj = jasmine.createSpyObj('SvgUtilityService', ['getElementListBounds']);
        svgUtilityServiceSpyObj.getElementListBounds.and.returnValue(elementListBounds);

        TestBed.configureTestingModule({
            providers: [{ provide: SvgUtilityService, useValue: svgUtilityServiceSpyObj }],
        });

        service = TestBed.inject(ToolSelectionStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#updateSelectionRect should give the selection rect the bounds of the selected elements', () => {
        service.updateSelectionRect();
        expect(service.selectionRect).toEqual(elementListBounds);
    });

    it('#selectedElements should update the selection rect', () => {
        const updateSelectionRectSpy = spyOn<any>(service, 'updateSelectionRect');
        service.selectedElements = [];
        expect(updateSelectionRectSpy).toHaveBeenCalled();
    });

    it("#selectedElements should notify it's subcribers that it's value has changed", () => {
        // tslint:disable-next-line: no-string-literal
        const selectedElementsChangedSourceSpy = spyOn<any>(service['selectedElementsChangedSource'], 'next');
        service.selectedElements = [];
        expect(selectedElementsChangedSourceSpy).toHaveBeenCalled();
    });
});
