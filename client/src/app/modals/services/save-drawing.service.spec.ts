import { TestBed } from '@angular/core/testing';

import { SaveDrawingService } from '@app/modals/services/save-drawing.service';

describe('SaveDrawingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SaveDrawingService = TestBed.inject(SaveDrawingService);
        expect(service).toBeTruthy();
    });
});
