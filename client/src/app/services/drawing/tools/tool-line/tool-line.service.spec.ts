import { TestBed } from '@angular/core/testing';

import { ToolLineService } from './tool-line.service';

describe('ToolLineService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolLineService = TestBed.get(ToolLineService);
        expect(service).toBeTruthy();
    });
});
