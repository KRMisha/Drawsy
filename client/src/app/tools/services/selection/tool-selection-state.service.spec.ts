import { TestBed } from '@angular/core/testing';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';
import { ToolSelectionCollisionService } from './tool-selection-collision.service';

// tslint:disable: no-any

describe('ToolSelectionStateService', () => {
    let toolSelectionCollisinoServiceSpyObj: jasmine.SpyObj<ToolSelectionCollisionService>;
    let service: ToolSelectionStateService;

    const elementListBounds = { x: 69, y: 420, width: 666, height: 69420 };

    beforeEach(() => {
        toolSelectionCollisinoServiceSpyObj = jasmine.createSpyObj('ToolSelectionCollisionService', ['getElementListBounds']);
        toolSelectionCollisinoServiceSpyObj.getElementListBounds.and.returnValue(elementListBounds);

        TestBed.configureTestingModule({
            providers: [{ provide: ToolSelectionCollisionService, useValue: toolSelectionCollisinoServiceSpyObj }],
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
