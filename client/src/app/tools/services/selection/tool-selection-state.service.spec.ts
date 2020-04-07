import { TestBed } from '@angular/core/testing';
import { ToolSelectionCollisionService } from '@app/tools/services/selection/tool-selection-collision.service';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

// tslint:disable: no-any

fdescribe('ToolSelectionStateService', () => {
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

    it('#selectedElements should update the selection rect', () => {
        // tslint:disable-next-line: no-string-literal
        const selectedElementChangedSourceSpy = spyOn<any>(service['selectedElementsRectChangedSource'], 'next');
        service.selectedElements = [];
        expect(selectedElementChangedSourceSpy).toHaveBeenCalled();
        expect(toolSelectionCollisionServiceSpyObj.getElementListBounds).toHaveBeenCalled();
    });

    it("#selectedElements should notify it's subcribers that it's value has changed", () => {
        // tslint:disable-next-line: no-string-literal
        const selectedElementsRectChangedSourceSpy = spyOn<any>(service['selectedElementsRectChangedSource'], 'next');
        service.selectedElements = [];
        expect(selectedElementsRectChangedSourceSpy).toHaveBeenCalled();
    });
});
