import { TestBed } from '@angular/core/testing';

import { ToolSelectionService } from './tool-selection.service';

describe('ToolSelectionService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSelectionService = TestBed.get(ToolSelectionService);
        expect(service).toBeTruthy();
    });
});
