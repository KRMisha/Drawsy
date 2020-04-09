import { TestBed } from '@angular/core/testing';

import { ToolSelectionTransformService } from './tool-selection-transform.service';

describe('ToolSelectionTransformService', () => {
    let service: ToolSelectionTransformService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectionTransformService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
