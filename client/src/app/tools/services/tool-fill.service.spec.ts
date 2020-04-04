import { TestBed } from '@angular/core/testing';

import { ToolFillService } from './tool-fill.service';

describe('ToolFillService', () => {
    let service: ToolFillService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolFillService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
