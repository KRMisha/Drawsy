import { TestBed } from '@angular/core/testing';

import { ToolSelectionMoverService } from './tool-selection-mover.service';

describe('ToolSelectionMoverService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSelectionMoverService = TestBed.inject(ToolSelectionMoverService);
        expect(service).toBeTruthy();
    });
});
