import { TestBed } from '@angular/core/testing';

import { DrawingPreviewService } from './drawing-preview.service';

describe('DrawingPreviewService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingPreviewService = TestBed.inject(DrawingPreviewService);
        expect(service).toBeTruthy();
    });
});
