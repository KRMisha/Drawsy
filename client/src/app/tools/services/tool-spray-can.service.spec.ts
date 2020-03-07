import { TestBed } from '@angular/core/testing';

import { ToolSprayCanService } from './tool-spray-can.service';

describe('ToolSprayCanService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolSprayCanService = TestBed.get(ToolSprayCanService);
        expect(service).toBeTruthy();
    });
});
