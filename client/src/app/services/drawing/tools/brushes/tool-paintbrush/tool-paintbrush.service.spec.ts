import { TestBed } from '@angular/core/testing';

import { ToolPaintbrushService } from './tool-paintbrush.service';

describe('ToolPaintbrushService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ToolPaintbrushService = TestBed.get(ToolPaintbrushService);
        expect(service).toBeTruthy();
    });
});
