import { TestBed } from '@angular/core/testing';

import { ToolBrushService } from './tool-brush.service';

describe('ToolBrushService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolBrushService = TestBed.get(ToolBrushService);
        expect(service).toBeTruthy();
    });
});
