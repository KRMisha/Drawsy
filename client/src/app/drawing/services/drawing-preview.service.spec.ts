import { TestBed } from '@angular/core/testing';
import { DrawingPreviewService } from '@app/drawing/services/drawing-preview.service';

describe('DrawingPreviewService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingPreviewService = TestBed.inject(DrawingPreviewService);
        expect(service).toBeTruthy();
    });
});
