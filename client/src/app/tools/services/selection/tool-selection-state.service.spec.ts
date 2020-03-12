import { TestBed } from '@angular/core/testing';

import { ToolSelectionStateService } from './tool-selection-state.service';

describe('ToolSelectionStateService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSelectionStateService = TestBed.get(ToolSelectionStateService);
        expect(service).toBeTruthy();
    });
});
