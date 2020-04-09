import { TestBed } from '@angular/core/testing';

import { ToolSelectionRotatorService } from './tool-selection-rotator.service';

describe('ToolSelectionRotatorService', () => {
    let service: ToolSelectionRotatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionRotatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
