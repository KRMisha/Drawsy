import { TestBed } from '@angular/core/testing';
import { ToolSelectionStateService } from '@app/tools/services/selection/tool-selection-state.service';

describe('ToolSelectionStateService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSelectionStateService = TestBed.inject(ToolSelectionStateService);
        expect(service).toBeTruthy();
    });
});
