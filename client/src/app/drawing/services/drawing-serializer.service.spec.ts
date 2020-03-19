import { TestBed } from '@angular/core/testing';

import { DrawingSerializerService } from '@app/drawing/services/drawing-serializer.service';

describe('DrawingSerializerService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DrawingSerializerService = TestBed.inject(DrawingSerializerService);
        expect(service).toBeTruthy();
    });
});
